// Informações veículo
// Marca
// Modelo
// Ano
// Motor
// Placa
// KM

import { Car } from "phosphor-react";
import { InputsInfoVeiculoContainer } from "./styles";
import { useForm } from "react-hook-form";

// interface VeiculoInputs {
//   marca: string;
//   modelo: string;
//   ano: string;
//   motor: string;
//   placa: string;
//   km: string;
// }

// interface InfoVeiculoProps {
//   register: UseFormRegister<VeiculoInputs>;
//   errors?: {
//     [key: string]: {
//       message?: string;
//     };
//   };
// }

export const InfoVeiculo = ({ register }) => {

  return (
    <InputsInfoVeiculoContainer>
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
    </InputsInfoVeiculoContainer>
  );
};
