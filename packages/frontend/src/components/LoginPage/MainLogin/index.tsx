import InputsLogin from 'components/globalComponents/InputsLogin';
import Logo from "components/globalComponents/Logo";
import ModalMessage from "components/globalComponents/ModalMessage";
import { useContextAuth } from "hooks/useLoginAuth";
import { useEffect, useState, useRef } from "react";
import FormValidate from "../FormValidate";
import { Button, Form, Inputs } from '../FormValidate/styles';
import * as S from "./styles";
import { useForm } from "react-hook-form";
import  Router from 'next/router';
import { setCookie } from 'nookies';




const MainLogin = () => {
  const { verifyUserCookie } = useContextAuth();
  const [errorAuth, setErrorAuth] = useState(false);
  const [modalCode, setModalCode] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<{code: string}>();
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = handleSubmit(async (data) => {
    if(data.code === "soil2021"){
      const propsCookie = { maxAge: 60 * 60 * 2 }; //2hours
      setCookie(undefined, "soilauth-code", "ok", propsCookie);
      Router.push("/createUser")
    }else{
      setModalCode(false)
    }
  });


  useEffect(() => {
    verifyUserCookie();
  }, []);


  return (
    <S.Container>
      <S.WrapperModalAndForm>
        <S.ContentForm>
          <S.ContentLogo>
            <Logo />
          </S.ContentLogo>
          <FormValidate setErrorAuth={setErrorAuth} />
          
        </S.ContentForm>
        
       
        {errorAuth && (
          <S.ContentModal>
            <ModalMessage
              alert="CREDENCIAIS INCORRETAS"
              subAlert="TENTE NOVAMENTE"
              txtButton="FECHAR"
              callbackButtonClick={setErrorAuth}
            >
              <S.IconAttention />
            </ModalMessage>
          </S.ContentModal>
        )}
        {modalCode && (
          <S.ContentModal>
            <S.FullContent>
            <S.IconClosed onClick={() => setModalCode(false)} />
            <S.AlertText>Somente administradores podem cadastrar novos usúarios,</S.AlertText>
            <S.AlertText>Entre com código de administrador ou faça login</S.AlertText>
              <Form onSubmit={onSubmit} ref={formRef} style={{width: "max-content"}}>
                <InputsLogin error={errors.code && errors.code.message}>
                  <Inputs
                    id="code"
                    type="text"
                    placeholder="Digite seu usuário"
                    {...register("code", {
                      required: "Por favor digite seu nome de usuário",
                    })}
                  />
                </InputsLogin>
                <Button type="submit" value='Enviar' />
              </Form> 
            </S.FullContent>      
          </S.ContentModal>
        )}
      </S.WrapperModalAndForm>

      <S.Button
          text="Cadastre-se" 
          callbackSendEvent={() => setModalCode(true)} />
        
      <S.TextTech>TECNOLOGIA </S.TextTech>
      <S.TextTech>PARA IRRIGAÇÃO</S.TextTech>
    </S.Container>
  );
};

export default MainLogin;
