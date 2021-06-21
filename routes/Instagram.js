var express = require("express");
const {
  uploadFeedWeb,
  uploadFeedAlbumAPI,
  uploadStoryAPI,
  uploadFeedSingleAPI,
  cekLoginAPI,
} = require("../api");
var router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  if (username !== "" && password !== "") {
    cekLoginAPI(username, password, (login) => {
      switch (login) {
        case "IgLoginTwoFactorRequiredError: POST /api/v1/accounts/login/ - 400 Bad Request; ":
          res.send({
            message: "Harap matikan Autentikasi Dua Faktor",
          });
          break;
        case "IgResponseError: POST /api/v1/accounts/login/ - 400 Bad Request; Please wait a few minutes before you try again.":
          res.send({
            message:
              "Harap matikan Autentikasi Dua Faktor dan tunggu beberapa saat sebelum kembali mencoba",
          });
          break;
        case "IgResponseError: POST /api/v1/accounts/login/ - 400 Bad Request; You entered the wrong code too many times. Wait a few minutes and try again.":
          res.send({
            message:
              "Harap matikan Autentikasi Dua Faktor dan tunggu beberapa saat sebelum kembali mencoba, atau akun anda akan terkunci karena terlalu banyak percobaan login",
          });
          break;
        case "IgLoginBadPasswordError: POST /api/v1/accounts/login/ - 400 Bad Request; The password you entered is incorrect. Please try again.":
          res.send({
            message: "username/password salah",
          });
          break;
        case "IgLoginInvalidUserError: POST /api/v1/accounts/login/ - 400 Bad Request; The username you entered doesn't appear to belong to an account. Please check your username and try again.":
          res.send({
            message: "username/password salah",
          });
          break;
        default:
          res.send(login);
          break;
      }
    });
  } else {
    res.send({ message: "harap masukan username & password" });
  }
});

router.post("/feed", async (req, res) => {
  const { username, password, picture, namaProduk, harga, variant } = req.body;
  if (username !== "" && password !== "") {
    if (picture && picture.length > 1 && picture !== "") {
      await uploadFeedAlbumAPI(
        username,
        password,
        picture,
        namaProduk,
        harga,
        variant,
        (upload) => {
          console.log(upload);
          switch (upload) {
            case "IgLoginTwoFactorRequiredError: POST /api/v1/accounts/login/ - 400 Bad Request; ":
              res.send({
                message: "Harap matikan Autentikasi Dua Faktor",
              });
              break;
            case "IgResponseError: POST /api/v1/accounts/login/ - 400 Bad Request; Please wait a few minutes before you try again.":
              res.send({
                message:
                  "Harap matikan Autentikasi Dua Faktor dan tunggu beberapa saat sebelum kembali mencoba",
              });
              break;
            case "IgResponseError: POST /api/v1/accounts/login/ - 400 Bad Request; You entered the wrong code too many times. Wait a few minutes and try again.":
              res.send({
                message:
                  "Harap matikan Autentikasi Dua Faktor dan tunggu beberapa saat sebelum kembali mencoba, atau akun anda akan terkunci karena terlalu banyak percobaan login",
              });
              break;
            case "IgLoginBadPasswordError: POST /api/v1/accounts/login/ - 400 Bad Request; The password you entered is incorrect. Please try again.":
              res.send({
                message: "username/password salah",
              });
              break;
            case "IgLoginInvalidUserError: POST /api/v1/accounts/login/ - 400 Bad Request; The username you entered doesn't appear to belong to an account. Please check your username and try again.":
              res.send({
                message: "username/password salah",
              });
              break;
            case "error":
              res.send({
                message:
                  "Terjadi kesalahan harap periksa kembali data yang dikirimkan",
              });
              break;
            default:
              res.send(upload);
              break;
          }
        }
      );
    } else if (picture.length == 1) {
      await uploadFeedSingleAPI(
        username,
        password,
        picture[0],
        namaProduk,
        harga,
        variant,
        (upload) => {
          console.log(upload);
          switch (upload) {
            case "username/password salah":
              res.send({ message: "username/password salah" });
              break;
            case "error":
              res.send({
                message:
                  "Terjadi kesalahan harap periksa kembali data yang dikirimkan",
              });
              break;
            case "IgResponseError: POST /api/v1/accounts/login/ - 400 Bad Request; Please wait a few minutes before you try again.":
              res.send({
                message: "Harap matikan Autentikasi Dua Faktor",
              });
              break;
            default:
              res.send(upload);
              break;
          }
        }
      );
    } else res.send({ message: "harap masukan gambar" });
  } else {
    res.send({ message: "harap masukan username & password" });
  }
});

router.post("/story", async (req, res) => {
  const { username, password, picture } = req.body;
  console.log(picture);
  if (username !== "" && password !== "") {
    if (picture && picture !== "") {
      await uploadStoryAPI(username, password, picture, (upload) => {
        console.log(upload);
        res.send(upload);
        switch (upload) {
          case "username/password salah":
            res.send({ message: "username/password salah" });
            break;
          case "error":
            res.send({
              message:
                "Terjadi kesalahan harap periksa kembali data yang dikirimkan",
            });
            break;
          default:
          case "IgResponseError: POST /api/v1/accounts/login/ - 400 Bad Request; Please wait a few minutes before you try again.":
            res.send({
              message: "Harap matikan Autentikasi Dua Faktor",
            });
            break;
            res.send(upload);
            break;
        }
      });
    } else res.send({ message: "harap masukan link gambar yang benar" });
  } else {
    res.send({ message: "harap masukan username & password" });
  }
});

router.post("/web/feed", async (req, res) => {
  const { username, password, picture, caption } = req.body;
  console.log(req.body);
  if (username !== "" && password !== "") {
    await uploadFeedWeb(username, password, picture, caption, (upload) => {
      console.log(upload);
      switch (upload) {
        case "usepass wrong":
          res.send(
            `<script>alert("username/password salah");window.location.replace("/")</script>`
          );
          break;

        case "link null":
          res.send(
            `<script>alert("harap masukan link gambar");window.location.replace("/")</script>`
          );
          break;
        case "sukses":
          res.send(
            `<script>alert("Upload Sukses");window.location.replace("/")</script>`
          );
          break;

        case "error":
          res.send(
            `<script>alert("Upload Error atau username/password salah");window.location.replace("/")</script>`
          );
          break;

        default:
          break;
      }
    });
  } else {
    res.send(
      `<script>alert("masukan username/password");window.location.replace("/")</script>`
    );
  }
});

module.exports = router;
