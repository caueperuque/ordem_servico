import { Database } from "phosphor-react";
import { InputDataContainer } from "./styles";

//Data entrada - saída
export const InputData = () => {
  return (
    <InputDataContainer>
      <header>
        <h3>Data do serviço prestado</h3>
        <Database size={20} />
      </header>
      <div className="row" style={{ justifyContent: "center" }}>
        <div className="input-group" style={{ width: "40%" }}>
          <label htmlFor="">Data de entrada</label>
          <input type="date" name="" id="" style={{ textAlign: "center" }} />
        </div>
        <div className="input-group" style={{ width: "40%" }}>
          <label htmlFor="">Data de saída</label>
          <input type="date" name="" id="" style={{ textAlign: "center" }} />
        </div>
      </div>
    </InputDataContainer>
  );
};
