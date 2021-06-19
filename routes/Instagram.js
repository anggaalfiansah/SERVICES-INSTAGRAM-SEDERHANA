var express = require("express");
const {
  uploadFeedWeb,
  uploadFeedAlbumAPI,
  uploadStoryAPI,
  uploadFeedSingleAPI,
} = require("../api");
var router = express.Router();

/* Post Feed With Caption */
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
