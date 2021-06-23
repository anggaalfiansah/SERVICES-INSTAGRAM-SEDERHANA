var express = require("express");
const { cekLoginFacebook, getListChat, logoutFacebook, getListChatById, replyChatByUserId } = require("../api");
var router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await cekLoginFacebook(email, password, (login) => {
    res.send(login);
  });
});

router.post("/logout", async (req, res) => {
  const { token } = req.body;
  await logoutFacebook(token, (logout) => {
    res.send(logout);
  });
});

router.get("/chat", async (req, res) => {
  const { token } = req.body;
  await getListChat(token, (chat) => {
    res.send(chat);
  });
});
router.get("/chat/:id", async (req, res) => {
  const { token } = req.body;
  const threadId = req.params.id
  await getListChatById(token, threadId, (chat) => {
    res.send(chat);
  });
});

router.post("/reply/:id", async (req, res) => {
  const { token, pesan } = req.body;
  const userId = req.params.id
  await replyChatByUserId(token, userId, pesan, (chat) => {
    res.send(chat);
  });
});

module.exports = router;
