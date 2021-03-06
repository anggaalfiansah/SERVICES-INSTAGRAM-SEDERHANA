const { IgApiClient } = require("instagram-private-api");
const facebookLogin = require("ts-messenger-api").default;
const facebookLogin2 = require("facebook-chat-api");
var { get } = require("request-promise");
const sharp = require("sharp");

//  Instagram  =================================================================================================
exports.cekLoginAPI = async (username, password, cb) => {
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  const auth = await ig.account
    .login(username, password)
    .catch((err) => cb(`${err}`));
  if (auth) {
    const logout = await ig.account.logout();
    console.log("Status Logout " + JSON.stringify(logout));
    cb({ message: "Instagram tersambung", data: auth });
  }
};

exports.uploadFeedAlbumAPI = async (
  username,
  password,
  picture,
  namaProduk,
  harga,
  variant,
  cb
) => {
  console.log(picture);
  let variantList = "";
  await Promise.all(
    variant.map(async (item) => {
      variantList += `-${item}\r\n`;
    })
  );
  const caption = `OPEN ORDER !!!\r\nNama Produk: ${namaProduk}\r\nHarga: ${harga}\r\nVarian:\r\n${variantList}Silahkan diorder`;
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  const auth = await ig.account
    .login(username, password)
    .catch((err) => cb(`${err}`));
  if (auth) {
    const albumItem = [];
    let gambarError = 0;
    await Promise.all(
      picture.map(async (item) => {
        const imageBuffer = await get({
          url: item,
          encoding: null, // this is required, only this way a Buffer is returned
        }).catch(async () => {
          await gambarError++;
          console.log("url tidak valid");
        });
        if (imageBuffer) {
          const gambar = await sharp(imageBuffer)
            .resize({ height: 800, width: 800 })
            .toFormat("jpeg")
            .toBuffer();
          await albumItem.push({ file: gambar, height: 800, width: 800 });
        }
      })
    );
    console.log(albumItem);
    if (albumItem.length > 1) {
      try {
        const publish = await ig.publish.album({
          items: albumItem, // image buffer, you also can specify image from your disk using fs
          caption: caption, // nice caption (optional)
        });
        const logout = await ig.account.logout();
        console.log("Status Logout " + JSON.stringify(logout));
        cb({ message: "Upload Feed Sukses", data: publish });
      } catch (error) {
        const logout = await ig.account.logout();
        console.log("Status Logout " + JSON.stringify(logout));
        console.log(error);
        cb("error");
      }
    } else {
      const logout = await ig.account.logout();
      console.log("Status Logout " + JSON.stringify(logout));
      cb({ message: "gambar kurang, gambar error " + gambarError });
    }
  }
};

exports.uploadFeedSingleAPI = async (
  username,
  password,
  picture,
  namaProduk,
  harga,
  variant,
  cb
) => {
  console.log(picture);
  let variantList = "";
  await Promise.all(
    variant.map(async (item) => {
      variantList += `-${item}\r\n`;
    })
  );
  const caption = `OPEN ORDER !!!\r\nNama Produk: ${namaProduk}\r\nHarga: ${harga}\r\nVarian:\r\n${variantList}Silahkan diorder`;
  const ig = new IgApiClient();
  ig.state.generateDevice(username);
  const auth = await ig.account
    .login(username, password)
    .catch((err) => cb(`${err}`));
  if (auth) {
    const imageBuffer = await get({
      url: picture,
      encoding: null, // this is required, only this way a Buffer is returned
    }).catch(async () => {
      cb({ message: "url invalid" });
    });
    if (imageBuffer) {
      const gambar = await sharp(imageBuffer)
        .resize({ height: 800, width: 800 })
        .toFormat("jpeg")
        .toBuffer();
      try {
        const publish = await ig.publish.photo({
          file: gambar, // image buffer, you also can specify image from your disk using fs
          caption: caption, // nice caption (optional)
        });
        const logout = await ig.account.logout();
        console.log("Status Logout " + JSON.stringify(logout));
        cb({ message: "Upload Feed Sukses", data: publish });
      } catch (error) {
        const logout = await ig.account.logout();
        console.log("Status Logout " + JSON.stringify(logout));
        console.log(error);
        cb("error");
      }
    }
  }
};

exports.uploadStoryAPI = async (username, password, picture, cb) => {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    const auth = await ig.account
      .login(username, password)
      .catch((err) => cb(`${err}`));
    if (auth) {
      const imageBuffer = await get({
        url: picture,
        encoding: null, // this is required, only this way a Buffer is returned
      });
      const gambar = await sharp(imageBuffer)
        .resize({ height: 800, width: 800 })
        .toFormat("jpeg")
        .toBuffer();
      const launch = await ig.publish.story({ file: gambar });
      const logout = await ig.account.logout();
      console.log("Status Logout " + JSON.stringify(logout));
      cb({ message: "Upload Story Sukses", data: launch });
    }
  } catch (error) {
    console.log(error);
    cb("error");
  }
};

exports.uploadFeedWeb = async (username, password, picture, caption, cb) => {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(username);
    const auth = await ig.account.login(username, password);
    console.log(auth);
    let albumItem = [];
    if (auth) {
      await Promise.all(
        picture.map(async (item) => {
          if (item !== "") {
            const imageBuffer = await get({
              url: item,
              encoding: null, // this is required, only this way a Buffer is returned
            });
            const gambar = await sharp(imageBuffer)
              .resize({ height: 800, width: 800 })
              .toFormat("jpeg")
              .toBuffer();
            await albumItem.push({ file: gambar, height: 800, width: 800 });
          }
        })
      );
      console.log(albumItem.length);
      if (albumItem !== []) {
        await ig.publish.album({
          items: albumItem, // image buffer, you also can specify image from your disk using fs
          caption: caption, // nice caption (optional)
        });
        const logout = await ig.account.logout();
        console.log("Status Logout " + JSON.stringify(logout));
        await ig.account.logout();
        cb("sukses");
      } else {
        await ig.account.logout();
        cb("link null");
      }
    } else cb("userpass wrong");
  } catch (error) {
    console.log(error);
    cb("error");
  }
};

// Facebook =================================================================================================
exports.loginFacebook = async (email, password, cb) => {
  try {
    const api = await facebookLogin({
      email: email,
      password: password,
    });
    const apis = await api.getAppState();
    cb({ message: "Login Sukses", token: { appState: apis } });
  } catch (error) {
    cb({ message: `Login Gagal, error : ${error.error}`, error: error.error });
  }
};
// OK

exports.logoutFacebook = async (token, cb) => {
  let timeout = Math.floor(Math.random() * 30000);
  try {
    const api = await facebookLogin(token);
    setTimeout(async () => {
      console.log(timeout)
      await api.logout();
      cb({ message: `Logout Sukses` });
    }, timeout);
  } catch (error) {
    cb({ message: `Logout Gagal, error : ${error.error}`, error: error.error });
  }
};
// OK

exports.getListChat = async (token, cb) => {
  let timeout = Math.floor(Math.random() * 30000);
  try {
    await facebookLogin2(token, (err, api) => {
      setTimeout(async () => {
        console.log(timeout);
        if (err) return console.error(err);
        api.getThreadList(100, null, [], (list) => {
          cb({ message: "List Chat Berhasil Didapatkan", chat: list });
        });
      }, timeout);
    });
  } catch (error) {
    cb({ message: `List Chat Gagal Didapatkan`, error: error.error });
  }
};
// ????

exports.getFriendList = async (token, cb) => {
  let timeout = Math.floor(Math.random() * 30000);
  try {
    const api = await facebookLogin(token);
    setTimeout(async () => {
      console.log(timeout);
      const friends = await api.getFriendsList();
      cb({ message: `Daftar Teman Berhasil Didapatkan`, friend: friends });
    }, timeout);
  } catch (error) {
    cb({ message: `Daftar Teman Gagal Didapatkan`, error: error.error });
  }
};
// OK

exports.getListChatById = async (token, threadId, cb) => {
  let timeout = Math.floor(Math.random() * 30000);
  try {
    const api = await facebookLogin(token);
    setTimeout(async () => {
      console.log(timeout);
      const chat = await api.getThreadHistory(threadId, 100);
      cb({ message: "Chat Berhasil Didapatkan", chat: chat });
    }, timeout);
  } catch (error) {
    cb({ message: `Chat Gagal Didapatkan`, error: error.error });
  }
};
// OK

exports.replyChatByUserId = async (token, userId, pesan, cb) => {
  let timeout = Math.floor(Math.random() * 30000);
  try {
    const api = await facebookLogin(token);
    setTimeout(async () => {
      console.log(timeout);
      await api.listen();
      setTimeout(async () => {
        console.log(timeout);
        await api.sendMessage({ body: pesan }, userId);
        setTimeout(async () => {
          console.log(timeout);
          await api.stopListening();
          cb({ message: "Pesan Terkirim" });
        }, timeout);
      }, timeout);
    }, timeout);
  } catch (error) {
    cb({ message: `Pesan Tidak Terkirim`, error: error.error });
  }
};
// OK
