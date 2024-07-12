import "../../styles/components/ManageFooter.scss";

import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const ManageFooter: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__column">
          <h4>Company</h4>
          <ul>
            <li>
              <a href="https://www.spotify.com/us/about-us/contact/">About</a>
            </li>
            <li>
              <a href="https://www.lifeatspotify.com/#_gl=1*1o8p6x6*_gcl_au*MzQ4NTQxNzEyLjE3MTk1NjYxODY.">
                Jobs
              </a>
            </li>
            <li>
              <a href="https://newsroom.spotify.com/">For the record</a>
            </li>
          </ul>
        </div>
        <div className="footer__column">
          <h4>Communities</h4>
          <ul>
            <li>
              <a href="https://artists.spotify.com/home">For Artists</a>
            </li>
            <li>
              <a href="#">Developers</a>
            </li>
            <li>
              <a href="#">Advertising</a>
            </li>
            <li>
              <a href="#">Investors</a>
            </li>
            <li>
              <a href="#">Vendors</a>
            </li>
          </ul>
        </div>
        <div className="footer__column">
          <h4>Useful Links</h4>
          <ul>
            <li>
              <a href="#">Support</a>
            </li>
            <li>
              <a href="#">Free Mobile App</a>
            </li>
          </ul>
        </div>
        <div className="footer__column">
          <h4>Njotify Plans</h4>
          <ul>
            <li>
              <a href="#">Premium Individual</a>
            </li>
            <li>
              <a href="#">Premium Duo</a>
            </li>
            <li>
              <a href="#">Premium Family</a>
            </li>
            <li>
              <a href="#">Premium Student</a>
            </li>
            <li>
              <a href="#">Njotify Free</a>
            </li>
          </ul>
        </div>
        <div className="footer__icons">
          <a href="https://www.instagram.com/spotify/" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://x.com/Spotify" aria-label="Twitter">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            href="https://www.facebook.com/SpotifyID/?brand_redir=6243987495"
            aria-label="Facebook"
          >
            <FontAwesomeIcon icon={faFacebookF} />
          </a>
        </div>
      </div>
      <div className="footer__bottom">
        <ul>
          <li>
            <a href="#">Legal</a>
          </li>
          <li>
            <a href="#">Safety & Privacy Center</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Cookies</a>
          </li>
          <li>
            <a href="#">About Ads</a>
          </li>
          <li>
            <a href="#">Accessibility</a>
          </li>
        </ul>
        <p>&copy; 2024 Njotify AB</p>
      </div>
    </footer>
  );
};

export default ManageFooter;
