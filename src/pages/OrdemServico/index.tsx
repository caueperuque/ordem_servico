import { SubmitHandler, useForm } from "react-hook-form";
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
import { Car, Database, Plus, Trash, User, Wrench } from "phosphor-react";
import { Toaster } from "sonner";
import { useState } from "react";

export const OrdemServico = () => {
  const dataSchema = z.object({
    data_entrada: z.string(),
    data_saida: z.string(),
    nome: z.string().min(3).max(100),
    cpf_cnpj: z.string().min(11).max(11),
    rg_inscricao: z.string().min(9).max(9),
    cep: z.string().min(8).max(8),
    cidade: z.string().min(3).max(100),
    estado: z.string().min(2).max(2),
    bairro: z.string().min(3).max(100),
    numero: z.string().min(1).max(10),
    endereco: z.string().min(10).max(200),
    marca: z.string().min(3).max(100),
    modelo: z.string().min(3).max(100),
    ano: z.string().min(4).max(4),
    motor: z.string().min(3).max(100),
    placa: z.string().min(7).max(7),
    km: z.number(),
  });

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(dataSchema),
  });

  type Inputs = {
    data_entrada: string;
    data_saida: string;
    nome: string;
    cpf: string;
    rg: string;
    cep: string;
    cidade: string;
    estado: string;
    bairro: string;
    numero: string;
    endereco: string;
    marca: string;
    modelo: string;
    ano: string;
    motor: string;
    placa: string;
    pecasServicos: {
      qtde: string;
      cod: string;
      descricao: string;
      valorUnit: string;
      total: string;
    }[];
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log("data", data);
    generatePDF(data);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return "Data inválida";
    }
  };

  const generatePDF = (data: Inputs) => {
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 10;
    let currentY = margin;

    // Cabeçalho
    pdf.setFontSize(18);
    pdf.text("Ordem de Serviço", margin, currentY);
    currentY += 10;

    // Datas
    pdf.setFontSize(12);
    pdf.text(
      `Data de entrada: ${formatDate(data.data_entrada)}`,
      margin,
      currentY
    );
    currentY += 8;

    if (data.data_saida) {
      pdf.text(
        `Data de saída: ${formatDate(data.data_saida)}`,
        margin,
        currentY
      );
      currentY += 8;
    }

    // Divisória
    pdf.setLineWidth(0.5);
    pdf.line(
      margin,
      currentY,
      pdf.internal.pageSize.getWidth() - margin,
      currentY
    );
    currentY += 10;

    // Dados do Cliente
    pdf.setFontSize(14);
    pdf.text("Dados do Cliente", margin, currentY);
    currentY += 8;

    pdf.setFontSize(12);
    const clientData = [
      `Nome: ${data.nome || "N/D"}`,
      `CPF: ${data.cpf || "N/D"}`,
      `RG: ${data.rg || "N/D"}`,
      `Endereço: ${data.endereco || "N/D"}, ${data.numero || "S/N"}`,
      `Bairro: ${data.bairro || "N/D"}`,
      `CEP: ${data.cep || "N/D"}`,
      `Cidade/UF: ${data.cidade || "N/D"} - ${data.estado || "N/D"}`,
    ];

    clientData.forEach((line) => {
      pdf.text(line, margin, currentY);
      currentY += 6;
    });
    currentY += 10;

    // Dados do Veículo
    pdf.setFontSize(14);
    pdf.text("Dados do Veículo", margin, currentY);
    currentY += 8;

    pdf.setFontSize(12);
    const vehicleData = [
      `Marca: ${data.marca || "N/D"}`,
      `Modelo: ${data.modelo || "N/D"}`,
      `Ano: ${data.ano || "N/D"}`,
      `Motor: ${data.motor || "N/D"}`,
      `Placa: ${data.placa || "N/D"}`,
    ];

    vehicleData.forEach((line) => {
      pdf.text(line, margin, currentY);
      currentY += 6;
    });
    currentY += 10;

    // Tabela de Peças/Serviços
    if (data.pecasServicos?.length > 0) {
      pdf.setFontSize(14);
      pdf.text("Produtos/Serviços", margin, currentY);
      currentY += 10;

      autoTable(pdf, {
        startY: currentY,
        head: [["Qtde", "Código", "Descrição", "Valor Unitário", "Total"]],
        body: data.pecasServicos.map((item) => [
          item.qtde,
          item.cod,
          item.descricao,
          `R$ ${Number(item.valorUnit).toFixed(2)}`,
          `R$ ${Number(item.total).toFixed(2)}`,
        ]),
        theme: "grid",
        styles: { fontSize: 10 },
        margin: { left: margin },
      });
    }

    pdf.save("ordem-servico.pdf");
  };

  const today = new Date().toISOString().split("T")[0];

  const [rows, setRows] = useState<object[]>([]);

  const addNewRow = () => {
    setRows((prev) => {
      const allRows = prev;
      allRows.push({
        id: Date.now().toString(),
        qtde: "",
        cod: "",
        descricao: "",
        valorUnit: "",
        total: "",
      });

      return rows;
    });
  };

  // Remove linha
  const handleRemove = (index: number) => {
    if (rows.length === 1) return;
    const excludeRow = rows.filter((row) => row.id !== index);
    setRows(excludeRow);
  };

  return (
    <OrdemServicoContainer>
      <h1>Nova ordem de serviço</h1>
      <Separator />
      <form>
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
              <input {...register("data_saida")} type="date" min={today} />
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
              {/* {errors?.motor && (
            <span className="error-message">{errors.motor.message}</span>
          )} */}
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
              {/* {errors?.placa && (
            <span className="error-message">{errors.placa.message}</span>
          )} */}
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
          <Toaster richColors closeButton position="top-right" />
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
                {rows.map((field, index) => (
                  <tr key={field.id}>
                    <td>
                      <input
                        type="number"
                        {...register(`pecasServicos.${index}.qtde`)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        {...register(`pecasServicos.${index}.cod`)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        {...register(`pecasServicos.${index}.descricao`)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        {...register(`pecasServicos.${index}.valorUnit`)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        {...register(`pecasServicos.${index}.total`)}
                        readOnly
                      />
                    </td>
                    <td>
                      <div>
                        {rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemove(index)}
                          >
                            <Trash />
                          </button>
                        )}
                        {index === rows.length - 1 && (
                          <button
                            type="button"
                            onClick={addNewRow}
                            style={{ marginLeft: "8px" }}
                          >
                            <Plus />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </InfoPecasServicosContainer>
        <button type="submit">Gerar PDF</button>
      </form>
    </OrdemServicoContainer>
  );
};
