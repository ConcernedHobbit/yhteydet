import { useEffect, useState } from "react";
import "react-responsive-modal/styles.css";
import "./Tutorial.css";
import { Modal } from "react-responsive-modal";

function Tutorial() {
  const [open, setOpen] = useState(false);

  const onCloseModal = () => {
    setOpen(false);
    window.localStorage.setItem("tutorial-seen", "1");
  };

  useEffect(() => {
    if (window.localStorage.getItem("tutorial-seen") === null) {
      setOpen(true);
    }
  }, [setOpen]);

  return (
    <div>
      <Modal
        open={open}
        onClose={onCloseModal}
        modalId="tutorial-modal"
        containerId="tutorial-modal__container"
      >
        <h2>Yhteydet</h2>
        <p>Tavoitteenasi on löytää neljän sanan ryhmiä.</p>
        <ul>
          <li>Valitse neljän sanan ryhmä ja paina "Kokeile"</li>
          <li>Löydä ryhmät ilman että teet 4 virhettä</li>
        </ul>
        <p>Kategoriat voivat olla esimerkiksi</p>
        <ul>
          <li>___PALLO: jalka, käsi, golf, ilma</li>
          <li>KALAT: ahven, kuha, kampela, silakka</li>
        </ul>
        <p>
          Pulmiin on aina tasan yksi ratkaisu. Varo sanoja, jotka voisivat olla
          monessa kategoriassa!
        </p>
        <h3>Päivän Yhteys</h3>
        <p>
          Yhteydet toimii kuiten New York Timesin{" "}
          <a
            href="https://www.nytimes.com/games/connections"
            target="_blank"
            rel="noreferrer noopener"
          >
            Connections
          </a>
          -peli.
        </p>
        <p>
          Joka päivä on kaikille yhteinen Päivän Yhteys. Päivän Yhteyden
          pelattua voi jatkaa vapaapelinä.
        </p>
        <p>
          Painamalla "Jaa" pelin jälkeen saat kopioitua leikepöydälle
          emojiversion pelistä, jonka voit jakaa kavereille!
        </p>
        <button onClick={onCloseModal}>Pelaamaan!</button>
      </Modal>
    </div>
  );
}

export default Tutorial;
