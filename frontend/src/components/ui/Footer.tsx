import "../../styles/components/Footer.scss";

import logo from "../../assets/njotify_logo.png";
const Footer = () => {
  return (
    <div className={"footer-container"}>
      <div className={"logo-container"}>
        <img className={"logo"} src={logo} alt="" />
        <h1>NJotify</h1>
        <div className={"link-container"}>
          <h5>Hukum</h5>
          <h5>Pusat Keamanan & Privasi</h5>
          <h5>Kebijakan Privasi</h5>
          <h5>Cookie</h5>
          <h5>Tentang iklan</h5>
          <h5>Aksesilitas</h5>
        </div>
      </div>
      <div className={"bottom-container"}>
        <h5>@ 2024 Spotify AS</h5>
      </div>
    </div>
  );
};

export default Footer;
