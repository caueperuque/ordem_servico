import { Plus, Trash, Wrench } from "phosphor-react";
import { InfoPecasServicosContainer } from "./styles";
import { Toaster } from "sonner";
import { useFieldArray, useForm } from "react-hook-form";
import { useState } from "react";

interface RowData {
  id: string;
  qtde: string;
  cod: string;
  descricao: string;
  valorUnit: string;
  total: string;
}

export const InfoPecasServicos = ({ register }) => {
  // Atualiza valores e calcula total
  // const handleInputChange = (index: number, field: keyof RowData, value: string) => {
  //   const fieldName = `pecasServicos.${index}.${field}`;
  //   setValue(fieldName, value);

  //   if (field === "qtde" || field === "valorUnit") {
  //     const qtde = parseFloat(getValues(`pecasServicos.${index}.qtde`) || 0);
  //     const valorUnit = parseFloat(getValues(`pecasServicos.${index}.valorUnit`) || 0);
  //     setValue(`pecasServicos.${index}.total`, (qtde * valorUnit).toFixed(2));
  //   }
  // };

  const [rows, setRows] = useState<object[]>([])

  const addNewRow = () => {
    setRows(prev => {
      const allRows = prev;
      allRows.push({
        id: Date.now().toString(),
        qtde: "",
        cod: "",
        descricao: "",
        valorUnit: "",
        total: "",
      })

      return rows
    });
  };

  // Remove linha
  const handleRemove = (index: number) => {
    if (rows.length === 1) return;
    const excludeRow = rows.filter(row => row.id !== index)
    setRows(excludeRow);
  };

  return (
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
                    // onChange={(e) => handleInputChange(index, "qtde", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    {...register(`pecasServicos.${index}.cod`)}
                    // onChange={(e) => handleInputChange(index, "cod", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    {...register(`pecasServicos.${index}.descricao`)}
                    // onChange={(e) => handleInputChange(index, "descricao", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    {...register(`pecasServicos.${index}.valorUnit`)}
                    // onChange={(e) => handleInputChange(index, "valorUnit", e.target.value)}
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
  );
};