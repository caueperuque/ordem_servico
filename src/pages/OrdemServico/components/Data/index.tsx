import { InputDataContainer } from "./styles";

//Data entrada - saída
export const InputData = () => {
  return (
    <InputDataContainer>
      <div>
        <label htmlFor="">Data de entrada</label>
        <input type="datetime-local" name="" id="" />
      </div>
      <div>
        <label htmlFor="">Data de saída</label>
        <input type="datetime-local" name="" id="" />
      </div>
    </InputDataContainer>
  );
};
