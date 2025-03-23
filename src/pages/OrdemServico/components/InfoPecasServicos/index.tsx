// Qtde
// Cod
// Descrição
// Valor unit
// total

import { Wrench } from "phosphor-react";
import { InfoPecasServicosContainer } from "./styles";

export const InfoPecasServicos = () => {
  return (
    <InfoPecasServicosContainer>
      <header>
        <h3>Produtos / serviços</h3>
        <Wrench size={20} />
      </header>
      <div className="row">
        <table>
          <thead>
            <th>Qtde</th>
            <th>Cod</th>
            <th>Descrição</th>
            <th>Valor unit</th>
            <th>Total</th>
            <th>Incluir</th>
          </thead>
          <tbody>
            <tr>
              <td><input type="number" /></td>
              <td><input type="text" name="" id="" /></td>
              <td><textarea name="" id=""></textarea></td>
              <td><input type="number" /></td>
              <td><input type="number" name="" id="" /></td>
              <td>
                <button type="button">+</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </InfoPecasServicosContainer>
  );
};
