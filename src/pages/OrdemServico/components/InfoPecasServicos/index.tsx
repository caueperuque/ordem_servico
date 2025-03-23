import { useState } from "react";
import { Wrench } from "phosphor-react";
import { InfoPecasServicosContainer } from "./styles";

interface RowData {
  id: number;
  qtde: string;
  cod: string;
  descricao: string;
  valorUnit: string;
  total: string;
  isEditing: boolean;
}

export const InfoPecasServicos = () => {
  const [rows, setRows] = useState<RowData[]>([
    { id: 1, qtde: "", cod: "", descricao: "", valorUnit: "", total: "", isEditing: true },
  ]);

  // Valida se todos os campos da linha estão preenchidos
  const isRowComplete = (row: RowData) =>
    row.qtde !== "" &&
    row.descricao !== "" &&
    row.valorUnit !== "" &&
    row.total !== "";

  // Função para adicionar uma nova linha somente se a última estiver confirmada
  const addRow = () => {
    const lastRow = rows[rows.length - 1];
    if (lastRow.isEditing) {
      alert("Por favor, confirme a linha atual antes de adicionar uma nova.");
      return;
    }
    const newRow: RowData = {
      id: rows.length + 1,
      qtde: "",
      cod: "",
      descricao: "",
      valorUnit: "",
      total: "",
      isEditing: true,
    };
    setRows([...rows, newRow]);
  };

  interface HandleInputChangeProps {
    id: number;
    field: keyof RowData;
    value: string;
  }

  const handleInputChange = ({ id, field, value }: HandleInputChangeProps) => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          if (field === "qtde" || field === "valorUnit") {
            const qtde = parseFloat(updatedRow.qtde) || 0;
            const valorUnit = parseFloat(updatedRow.valorUnit) || 0;
            updatedRow.total = (qtde * valorUnit).toFixed(2);
          }
          return updatedRow;
        }
        return row;
      })
    );
  };

  // Confirma os dados da linha, desabilitando os inputs
  const confirmRow = (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (row && !isRowComplete(row)) {
      alert("Preencha todos os campos para confirmar a linha.");
      return;
    }
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isEditing: false } : row
      )
    );
  };

  // Permite reabilitar a edição da linha
  const editRow = (id: number) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, isEditing: true } : row
      )
    );
  };

  // Remove uma linha (somente se houver mais de uma)
  const removeRow = (id: number) => {
    if (rows.length === 1) return;
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  return (
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
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="number"
                    value={row.qtde}
                    onChange={(e) =>
                      handleInputChange({ id: row.id, field: "qtde", value: e.target.value })
                    }
                    disabled={!row.isEditing}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.cod}
                    onChange={(e) =>
                      handleInputChange({ id: row.id, field: "cod", value: e.target.value })
                    }
                    disabled={!row.isEditing}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={row.descricao}
                    onChange={(e) =>
                      handleInputChange({ id: row.id, field: "descricao", value: e.target.value })
                    }
                    disabled={!row.isEditing}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.valorUnit}
                    onChange={(e) =>
                      handleInputChange({ id: row.id, field: "valorUnit", value: e.target.value })
                    }
                    disabled={!row.isEditing}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.total}
                    onChange={(e) =>
                      handleInputChange({ id: row.id, field: "total", value: e.target.value })
                    }
                  />
                </td>
                <td>
                  {rows.length > 1 && (
                    <button type="button" onClick={() => removeRow(row.id)}>
                      Remover
                    </button>
                  )}
                  {row.isEditing ? (
                    <button type="button" onClick={() => confirmRow(row.id)} style={{ marginLeft: "8px" }}>
                      Confirmar
                    </button>
                  ) : (
                    <button type="button" onClick={() => editRow(row.id)} style={{ marginLeft: "8px" }}>
                      Editar
                    </button>
                  )}
                  {index === rows.length - 1 && !row.isEditing && (
                    <button type="button" onClick={addRow} style={{ marginLeft: "8px" }}>
                      +
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InfoPecasServicosContainer>
  );
};
