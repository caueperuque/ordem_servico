import { useFieldArray, useForm } from "react-hook-form";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  InfoPecasServicosContainer,
  InputContainer,
  OrdemServicoContainer,
  Separator,
} from "./styles";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Database, Trash, User, Wrench, Check } from "phosphor-react";
import { toast, Toaster } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { consultarCep } from "../../helpers/functions";

export const OrdemServico = () => {
  const dataSchema = z.object({
    data_entrada: z
      .string()
      .nonempty("A data de entrada é obrigatória")
      .refine((val) => !isNaN(Date.parse(val)), "Data de entrada inválida"),
    data_saida: z
      .string()
      .nonempty("A data de saída é obrigatória")
      .refine((val) => !isNaN(Date.parse(val)), "Data de saída inválida"),
    nome: z
      .string()
      .min(3, "O nome deve ter no mínimo 3 caracteres")
      .max(100, "O nome pode ter no máximo 100 caracteres"),
    cpf_cnpj: z
      .string()
      .min(11, "CPF/CNPJ deve ter 11 dígitos")
      .max(20, "CPF/CNPJ deve ter 11 dígitos"),
    rg_inscricao: z
      .string()
      .min(9, "RG/Inscrição deve ter 9 dígitos")
      .max(9, "RG/Inscrição deve ter 9 dígitos"),
    cep: z
      .string()
      .min(8, "CEP deve ter 8 dígitos")
      .max(8, "CEP deve ter 8 dígitos"),
    cidade: z
      .string()
      .min(3, "A cidade deve ter no mínimo 3 caracteres")
      .max(100, "A cidade pode ter no máximo 100 caracteres"),
    estado: z
      .string()
      .min(2, "O estado deve ter 2 caracteres")
      .max(2, "O estado deve ter 2 caracteres"),
    bairro: z
      .string()
      .min(3, "O bairro deve ter no mínimo 3 caracteres")
      .max(100, "O bairro pode ter no máximo 100 caracteres"),
    numero: z
      .string()
      .min(1, "O número é obrigatório")
      .max(10, "O número pode ter no máximo 10 caracteres"),
    endereco: z
      .string()
      .min(10, "O endereço deve ter no mínimo 10 caracteres")
      .max(200, "O endereço pode ter no máximo 200 caracteres"),
    marca: z
      .string()
      .min(3, "A marca deve ter no mínimo 3 caracteres")
      .max(100, "A marca pode ter no máximo 100 caracteres"),
    modelo: z
      .string()
      .min(3, "O modelo deve ter no mínimo 3 caracteres")
      .max(100, "O modelo pode ter no máximo 100 caracteres"),
    ano: z
      .string()
      .min(4, "O ano deve ter 4 dígitos")
      .max(4, "O ano deve ter 4 dígitos"),
    motor: z
      .string()
      .min(3, "O motor deve ter no mínimo 3 caracteres")
      .max(100, "O motor pode ter no máximo 100 caracteres"),
    placa: z
      .string()
      .min(7, "A placa deve ter 7 caracteres")
      .max(7, "A placa deve ter 7 caracteres"),
    km: z.coerce
      .number({
        invalid_type_error: "KM deve ser um número válido",
      })
      .min(1, "O campo KM não pode ser zero")
      .max(999999, "KM máximo é 999.999"),
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

  // Função para extrair o primeiro erro (já implementada)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractFirstError = (errors: any): string => {
    if (!errors) return "";
    if (errors.message) return errors.message;
    for (const key in errors) {
      if (Object.prototype.hasOwnProperty.call(errors, key)) {
        const error = extractFirstError(errors[key]);
        if (error) return error;
      }
    }
    return "";
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (errors: any) => {
    const firstError = extractFirstError(errors);
    if (firstError) {
      toast.error(firstError);
    }
  };

  type DataForm = z.infer<typeof dataSchema>;

  const { register, handleSubmit, setValue, watch, control } =
    useForm<DataForm>({
      resolver: zodResolver(dataSchema),
      shouldUnregister: false,
      mode: "onChange",
      defaultValues: {
        // Linha default não será considerada "adicionada"
        pecasServicos: [
          {
            qtde: 1,
            cod: "",
            descricao: "",
            valorUnit: 0,
            total: 0,
            adicionado: false,
          },
        ],
      },
    });

  const { fields, append, remove } = useFieldArray({
    name: "pecasServicos",
    control,
  });

  const [totalGeral, setTotalGeral] = useState(0);
  const cepValue = watch("cep");

  useEffect(() => {
    const fetchAddress = async () => {
      if (cepValue && cepValue.length === 8) {
        try {
          const dadosCep = await consultarCep(cepValue);
          if (!dadosCep.erro) {
            setValue("endereco", dadosCep.logradouro || "");
            setValue("bairro", dadosCep.bairro || "");
            setValue("cidade", dadosCep.localidade || "");
            setValue("estado", dadosCep.uf || "");
          } else {
            console.error("CEP não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao consultar o CEP:", error);
        }
      }
    };

    fetchAddress();
  }, [cepValue, setValue]);

  const onSubmit = () => {
    generatePDF();
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {timeZone: 'UTC'});
    } catch {
      return "Data inválida";
    }
  };

  const generatePDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 10;
    let currentY = margin;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const headerHeight = 18; // altura do cabeçalho

    // Cabeçalho com fundo azul
    pdf.setFillColor(41, 128, 185);
    pdf.rect(margin, currentY, pageWidth - margin * 2, headerHeight, "F");
    const headerCenterY = currentY + headerHeight / 2 + 3;
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Stock Car", margin + 2, headerCenterY);
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(9);
    const contactInfo =
      "Cel: (18) 99700-0440, End.: Av. Joaquim Constantino 4161 - Presidente Prudente / SP";
    pdf.text(contactInfo, margin + 60, headerCenterY, {
      maxWidth: pageWidth - margin * 2 - 60,
    });
    pdf.setTextColor(0, 0, 0);
    currentY += headerHeight + 5;
    pdf.setLineWidth(0.5);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // Resto do PDF (dados do serviço, cliente, veículo, etc.)
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Ordem de Serviço", margin, currentY);
    currentY += 10;
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);
    pdf.text(
      `Data de entrada: ${formatDate(watch("data_entrada"))}`,
      margin,
      currentY
    );
    currentY += 8;
    if (watch("data_saida")) {
      pdf.text(
        `Data de saída: ${formatDate(watch("data_saida"))}`,
        margin,
        currentY
      );
      currentY += 8;
    }
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Dados do Cliente", margin, currentY);
    currentY += 8;
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);
    const clientData = [
      `Nome: ${watch("nome") || "N/D"}`,
      `CPF: ${watch("cpf_cnpj") || "N/D"}`,
      `RG: ${watch("rg_inscricao") || "N/D"}`,
      `Endereço: ${watch("endereco") || "N/D"}, ${watch("numero") || "S/N"}`,
      `Bairro: ${watch("bairro") || "N/D"}`,
      `CEP: ${watch("cep") || "N/D"}`,
      `Cidade/UF: ${watch("cidade") || "N/D"} - ${watch("estado") || "N/D"}`,
    ];
    clientData.forEach((line) => {
      pdf.text(line, margin, currentY);
      currentY += 6;
    });
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Dados do Veículo", margin, currentY);
    currentY += 8;
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);
    const vehicleData = [
      `Marca: ${watch("marca") || "N/D"}`,
      `Modelo: ${watch("modelo") || "N/D"}`,
      `Ano: ${watch("ano") || "N/D"}`,
      `Motor: ${watch("motor") || "N/D"}`,
      `Placa: ${watch("placa") || "N/D"}`,
    ];
    vehicleData.forEach((line) => {
      pdf.text(line, margin, currentY);
      currentY += 6;
    });
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 10;

    // Filtra as linhas que foram adicionadas (adicionado === true)
    const pecasAdicionadas = watch("pecasServicos").filter(
      (item) => item.adicionado === true
    );
    if (pecasAdicionadas.length > 0) {
      pdf.setFont("Helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Produtos/Serviços", margin, currentY);
      currentY += 6;
      pdf.setFont("Helvetica", "normal");

      autoTable(pdf, {
        startY: currentY,
        head: [["Qtde", "Código", "Descrição", "Valor Unitário", "Total"]],
        body: pecasAdicionadas.map((item) => [
          item.qtde,
          item.cod || "-",
          item.descricao,
          `R$ ${Number(item.valorUnit).toFixed(2)}`,
          `R$ ${Number(item.total).toFixed(2)}`,
        ]),
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          halign: "center",
        },
        bodyStyles: { halign: "center" },
        margin: { left: margin },
      });
      // Atualiza a posição com base na tabela
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      currentY = (pdf as any).lastAutoTable.finalY + 10;
    }

    // Total Geral com destaque (soma apenas as linhas adicionadas)
    const totalPDF = pecasAdicionadas.reduce(
      (acc, item) => acc + Number(item.total || 0),
      0
    );
    pdf.setFillColor(230, 230, 230);
    pdf.rect(margin, currentY, pageWidth - margin * 2, 10, "F");
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text(`Total: R$ ${totalPDF.toFixed(2)}`, margin + 2, currentY + 7);

    pdf.save(`ordem-servico-para-${watch("nome").replace(' ', '-').toLowerCase()}.pdf`);
  };

  const today = new Date().toISOString().split("T")[0];

  const addNewRow = () => {
    append({
      qtde: 1,
      cod: "",
      descricao: "",
      valorUnit: 0,
      total: 0,
      adicionado: false,
    });
  };

  const handleInclude = useCallback(
    (index: number) => {
      watch(`pecasServicos.${index}`);

      // Validações permanecem iguais...

      // Atualização correta usando a API do react-hook-form
      setValue(`pecasServicos.${index}.adicionado`, true, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue, watch]
  );

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith("pecasServicos")) {
        const parts = name.split(".");
        const index = Number(parts[1]);
        const field = parts[2];

        if (field === "qtde" || field === "valorUnit") {
          const qtde = Number(value.pecasServicos?.[index]?.qtde || 0);
          const valorUnit = Number(
            value.pecasServicos?.[index]?.valorUnit || 0
          );
          const novoTotal = qtde * valorUnit;
          if (Number(value.pecasServicos?.[index]?.total) !== novoTotal) {
            setValue(`pecasServicos.${index}.total`, novoTotal);
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // const [dataTable, setDataTable] = useState([]);

  // useEffect(() => {
  //   setDataTable(control._formValues.pecasServicos)
  // }, [handleInclude, control._formValues.pecasServicos])

  useEffect(() => {
    const subscription = watch((value) => {
      if (value && value.pecasServicos) {
        const novoTotalGeral = value.pecasServicos.reduce(
          (acc, item) => acc + Number(item?.total || 0),
          0
        );
        setTotalGeral(novoTotalGeral);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <OrdemServicoContainer>
      <Toaster richColors closeButton position="top-right" />
      <h1>Nova ordem de serviço</h1>
      <Separator />
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        {/* Datas */}
        <InputContainer>
          <header>
            <h3>Data do serviço prestado</h3>
            <Database size={20} />
          </header>
          <div className="row">
            <div className="input-group" style={{ flex: "1" }}>
              <label htmlFor="data_entrada">Data de entrada</label>
              <input {...register("data_entrada")} type="date" max={today} />
            </div>
            <div className="input-group" style={{ flex: "1" }}>
              <label htmlFor="data_saida">Data de saída</label>
              <input {...register("data_saida")} type="date" max={today} />
            </div>
          </div>
        </InputContainer>
        <Separator />
        {/* Informações do veículo */}
        <InputContainer>
          <header>
            <h3>Informações do veículo</h3>
            <Car size={20} />
          </header>
          <div className="row">
            <div className="input-group">
              <label htmlFor="marca">Marca:</label>
              <input
                {...register("marca", { required: "Campo obrigatório" })}
                type="text"
                placeholder="Ex: Ford"
                id="marca"
              />
            </div>
            <div className="input-group">
              <label htmlFor="modelo">Modelo:</label>
              <input
                {...register("modelo", { required: "Campo obrigatório" })}
                type="text"
                placeholder="Ex: Fiesta"
                id="modelo"
              />
            </div>
            <div className="input-group">
              <label htmlFor="ano">Ano:</label>
              <input
                {...register("ano")}
                type="number"
                placeholder="Ex: 2020"
                id="ano"
              />
            </div>
            <div className="input-group">
              <label htmlFor="motor">Motor:</label>
              <input
                {...register("motor")}
                type="text"
                placeholder="Ex: 1.0, 2.0, etc."
                id="motor"
              />
            </div>
            <div className="input-group">
              <label htmlFor="placa">Placa:</label>
              <input
                {...register("placa")}
                type="text"
                placeholder="Ex: ABC1D23"
                id="placa"
                maxLength={7}
              />
            </div>
            <div className="input-group">
              <label htmlFor="km">KM:</label>
              <input
                {...register("km")}
                type="number"
                placeholder="Quilometragem atual"
                id="km"
              />
            </div>
          </div>
        </InputContainer>
        <Separator />
        {/* Informações do cliente */}
        <InputContainer>
          <header>
            <h3>Informações do cliente</h3>
            <User size={20} />
          </header>
          <div className="row">
            <div className="input-group" style={{ width: "30%" }}>
              <label htmlFor="nome">Nome completo:</label>
              <input
                {...register("nome")}
                type="text"
                placeholder="Nome"
                id="nome"
              />
            </div>
            <div className="input-group" style={{ width: "25%" }}>
              <label htmlFor="cpfCnpj">CPF / CNPJ:</label>
              <input
                {...register("cpf_cnpj")}
                type="text"
                placeholder="CPF ou CNPJ"
                id="cpfCnpj"
              />
            </div>
            <div className="input-group" style={{ width: "25%" }}>
              <label htmlFor="inscricaoRg">Inscrição / RG:</label>
              <input
                {...register("rg_inscricao")}
                type="text"
                placeholder="Inscrição ou RG"
                id="inscricaoRg"
              />
            </div>
          </div>
          <div className="row">
            <div className="input-group">
              <label htmlFor="cep">CEP:</label>
              <input
                type="text"
                placeholder="CEP"
                id="cep"
                {...register("cep")}
                maxLength={8}
              />
            </div>
            <div className="input-group">
              <label htmlFor="cidade">Cidade:</label>
              <input
                {...register("cidade")}
                type="text"
                placeholder="Cidade"
                id="cidade"
              />
            </div>
            <div className="input-group">
              <label htmlFor="estado">Estado:</label>
              <input
                {...register("estado")}
                type="text"
                placeholder="Estado"
                id="estado"
              />
            </div>
            <div className="input-group">
              <label htmlFor="bairro">Bairro:</label>
              <input
                type="text"
                {...register("bairro")}
                placeholder="Bairro"
                id="bairro"
              />
            </div>
            <div className="input-group">
              <label htmlFor="endereco">Endereço:</label>
              <input
                type="text"
                {...register("endereco")}
                placeholder="Endereço"
                id="endereco"
              />
            </div>
            <div className="input-group">
              <label htmlFor="numero">Número:</label>
              <input
                type="text"
                {...register("numero")}
                placeholder="Número"
                id="numero"
              />
            </div>
          </div>
        </InputContainer>
        <Separator />
        {/* Tabela de peças e serviços */}
        <InfoPecasServicosContainer>
          <header>
            <h3>Produtos / serviços</h3>
            <Wrench size={20} />
          </header>

          <div className="row">
            <table>
              <thead>
                <tr>
                  <th>Qtde</th>
                  <th>Cod</th>
                  <th>Descrição</th>
                  <th>Valor unit</th>
                  <th>Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  const registerQtde = register(`pecasServicos.${index}.qtde`);
                  const registerCod = register(`pecasServicos.${index}.cod`);
                  const registerDesc = register(
                    `pecasServicos.${index}.descricao`
                  );
                  const registerUnit = register(
                    `pecasServicos.${index}.valorUnit`
                  );
                  const adicionado = watch(`pecasServicos.${index}.adicionado`);

                  return (
                    <tr key={field.id}>
                      <td>
                        <input
                          type="number"
                          step="any"
                          {...registerQtde}
                          onChange={(e) => {
                            registerQtde.onChange(e);
                            if (field.adicionado) {
                              setValue(
                                `pecasServicos.${index}.adicionado`,
                                false
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          {...registerCod}
                          onChange={(e) => {
                            registerCod.onChange(e);
                            if (field.adicionado) {
                              setValue(
                                `pecasServicos.${index}.adicionado`,
                                false
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          {...registerDesc}
                          onChange={(e) => {
                            registerDesc.onChange(e);
                            if (field.adicionado) {
                              setValue(
                                `pecasServicos.${index}.adicionado`,
                                false
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          {...registerUnit}
                          onChange={(e) => {
                            registerUnit.onChange(e);
                            if (field.adicionado) {
                              setValue(
                                `pecasServicos.${index}.adicionado`,
                                false
                              );
                            }
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          step="any"
                          {...register(`pecasServicos.${index}.total`)}
                          readOnly
                        />
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {adicionado ? (
                            <button
                              type="button"
                              onClick={() => handleRemove(index)}
                              style={{ background: "#ff2e2e" }}
                            >
                              <Trash />
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleInclude(index)}
                                style={{ background: "#2ecc71" }}
                              >
                                <Check />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                style={{ background: "#ff2e2e" }}
                              >
                                <Trash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              type="button"
              onClick={addNewRow}
              style={{
                padding: "10px",
                width: "25%",
                backgroundColor: "green",
                border: "none",
                borderRadius: "5px",
                color: "white",
              }}
            >
              Adicionar Novo Produto/Serviço
            </button>
          </div>
          <div
            className="total-geral"
            style={{
              textAlign: "right",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <h2>Total Geral: R$ {Number(totalGeral).toFixed(2)}</h2>
            <button
              type="submit"
              style={{
                border: "none",
                backgroundColor: "#00aaff",
                color: "white",
                padding: "1rem",
                borderRadius: "5px",
              }}
            >
              Gerar PDF
            </button>
          </div>
        </InfoPecasServicosContainer>
      </form>
    </OrdemServicoContainer>
  );
};
