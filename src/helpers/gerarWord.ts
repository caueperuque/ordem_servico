// src/utils/gerarWordTemplate.ts
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  BorderStyle,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
// import type { DataForm } from "../pages/OrdemServico";
import { formatDate } from "./functions";
import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dataSchema = z.object({
  data_entrada: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Data de entrada inválida",
  }),
  data_saida: z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Data de saída inválida",
  }),
  nome: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(100, "O nome pode ter no máximo 100 caracteres"),
  cpf_cnpj: z.string().optional(),
  celular: z.string().optional(),
  rg_inscricao: z.string().nullable().optional(),
  cep: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  bairro: z.string().optional(),
  numero: z.string().optional(),
  endereco: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano: z.string().optional(),
  motor: z.string().optional(),
  placa: z.string().optional(),
  km: z.coerce
    .number({
      invalid_type_error: "KM deve ser um número válido",
    })
    .optional(),
  // .min(1, "O campo KM não pode ser zero")
  // .max(999_999, "KM máximo é 999.999"),
  pecasServicos: z
    .object({
      qtde: z.coerce.number().min(1, "Quantidade mínima é 1"),
      cod: z.string(), // campo opcional sem validação customizada
      descricao: z.string().min(3, "Descrição muito curta"),
      valorUnit: z.coerce.number().min(0.01, "Valor unitário inválido"),
      total: z.coerce.number().min(0.01, "Total inválido"),
      adicionado: z.boolean(),
    })
    .array()
    .nonempty("Adicione pelo menos um item")
    .refine(
      (items) => items.some((item) => item.adicionado),
      "Pelo menos um item deve ser confirmado"
    ),
});

type DataForm = z.infer<typeof dataSchema>;

export async function gerarWord(
  dados: DataForm & { totalGeral: number; cnpjOrCpf: "cpf" | "cnpj" }
) {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            // margens em twips (720 twips = 0.5 polegada)
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: [
          // Cabeçalho sombreado com padding
          new Paragraph({
            shading: { fill: "2872B9" },
            children: [
              new TextRun({
                text: "Stock Car",
                bold: true,
                color: "FFFFFF",
                size: 32,
              }),
            ],
          }),
          new Paragraph({
            shading: { fill: "2872B9" },
            spacing: { before: 0, after: 200 },
            children: [
              new TextRun({
                text: "Cel: (18) 99771-0440 | Av. Joaquim Constantino 4161 - Presidente Prudente / SP",
                color: "FFFFFF",
                size: 18,
              }),
            ],
          }),

          // Espaçamento extra
          new Paragraph({ text: "", spacing: { after: 200 } }),

          // Título
          new Paragraph({
            children: [
              new TextRun({ text: "Ordem de Serviço", bold: true, size: 28 }),
            ],
            spacing: { after: 200 },
          }),

          // Datas
          new Paragraph({
            text: `Data de entrada: ${
              dados.data_entrada ? formatDate(dados.data_entrada) : "-"
            }`,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Data de saída: ${formatDate(dados.data_saida)}`,
            spacing: { after: 100 },
          }),

          // Linha horizontal
          new Paragraph({
            children: [],
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            },
            spacing: { after: 200 },
          }),

          // Dados do Cliente
          new Paragraph({
            children: [
              new TextRun({ text: "Dados do Cliente", bold: true, size: 24 }),
            ],
            spacing: { after: 100 },
          }),
          ...[
            `Nome: ${dados.nome || "-"}`,
            `Celular / Telefone: ${dados.celular || "-"}`,
            `${
              dados.cnpjOrCpf === "cpf" ? "CPF" : "CNPJ"
            }: ${dados.cpf_cnpj || "-"}`,
            `RG/Inscrição: ${dados.rg_inscricao || "-"}`,
            `Endereço: ${dados.endereco || "-"} Nº ${dados.numero || "-"}`,
            `Bairro: ${dados.bairro || "-"}`,
            `CEP: ${dados.cep || "-"}`,
            `Cidade/UF: ${dados.cidade || "-"} - ${dados.estado || "-"}`,
          ].map(
            (line) => new Paragraph({ text: line, spacing: { after: 100 } })
          ),
          new Paragraph({
            children: [],
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            },
            spacing: { after: 200 },
          }),

          // Dados do Veículo
          new Paragraph({
            children: [
              new TextRun({ text: "Dados do Veículo", bold: true, size: 24 }),
            ],
            spacing: { after: 100 },
          }),
          ...[
            `Marca: ${dados.marca || "-"}`,
            `Modelo: ${dados.modelo || "-"}`,
            `Ano: ${dados.ano || "-"}`,
            `Motor: ${dados.motor || "-"}`,
            `Placa: ${dados.placa || "-"}`,
            `KM: ${dados.km ?? "-"}`,
          ].map(
            (line) => new Paragraph({ text: line, spacing: { after: 100 } })
          ),
          new Paragraph({
            children: [],
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
            },
            spacing: { after: 200 },
          }),

          // Produtos / Serviços (tabela)
          new Paragraph({
            children: [
              new TextRun({
                text: "Produtos / Serviços",
                bold: true,
                size: 24,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Cabeçalho
              new TableRow({
                children: [
                  "Qtde",
                  "Código",
                  "Descrição",
                  "Valor Unitário",
                  "Total",
                ].map(
                  (txt) =>
                    new TableCell({
                      width: { size: 20, type: WidthType.PERCENTAGE },
                      shading: { fill: "2872B9" },
                      children: [
                        new Paragraph({
                          text: txt,
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                    })
                ),
              }),
              // Linhas de itens
              ...dados.pecasServicos
                .filter((item) => item.adicionado)
                .map(
                  (item) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 20, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              text: item.qtde.toString(),
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 20, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              text: item.cod || "-",
                              alignment: AlignmentType.CENTER,
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 20, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              text: item.descricao,
                              alignment: AlignmentType.LEFT,
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 20, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              text: `R$ ${item.valorUnit.toFixed(2)}`,
                              alignment: AlignmentType.RIGHT,
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 20, type: WidthType.PERCENTAGE },
                          children: [
                            new Paragraph({
                              text: `R$ ${item.total.toFixed(2)}`,
                              alignment: AlignmentType.RIGHT,
                            }),
                          ],
                        }),
                      ],
                    })
                ),
            ],
          }),
          new Paragraph({ text: "" }),
          // Total Geral
          new Paragraph({
            shading: { fill: "E6E6E6" },
            children: [
              new TextRun({
                text: `Total Geral: R$ ${dados.totalGeral.toFixed(2)}`,
                bold: true,
                size: 24,
              }),
            ],
            spacing: { before: 200 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(
    blob,
    `ordem-servico-${dados.nome.replace(/\s+/g, "-").toLowerCase()}.docx`
  );
}
