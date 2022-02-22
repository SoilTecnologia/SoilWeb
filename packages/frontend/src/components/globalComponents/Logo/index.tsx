import * as S from "./styles";
import LogoImage from "../../../../public/logos/logo-dark.png";
import Image from "next/image";

const Logo = () => {
  return (
    <S.ContentLogo>
      <Image
        layout="responsive"
        src={LogoImage}
        alt="Logo da empresa SoilTech"
      />
    </S.ContentLogo>
  );
};

export default Logo;
