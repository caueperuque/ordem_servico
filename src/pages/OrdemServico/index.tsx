import { SubmitHandler, useForm } from "react-hook-form";

const FormOrdemServico = () => {
  type Inputs = {
    example: string;
    exampleRequired: string;
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch("example")); // watch input value by passing the name of it

  /* Data entrada - saída

  //Informações veículo
     Marca
     Modelo
     Ano
     Motor
     Plcaca
     KM''

  //Dados do cliente
     Nome
     CPF/CNPJ
     Inscrição/RG
     Endereço / bairro
     CEP
     Cidade - estado

  // Peças/serviço
     Qtde
     Cod
     Descrição
     Valor unit
     total
 */

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input defaultValue="test" {...register("example")} />

      {/* include validation with required or other standard HTML validation rules */}
      <input {...register("exampleRequired", { required: true })} />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <input type="submit" />
    </form>
  );
};

export default FormOrdemServico;
