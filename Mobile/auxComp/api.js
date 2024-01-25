import axios from 'axios';
import config from "../auxComp/config.js";

// gameVVV purchaseVVV
export const getGame = async (gameId) => {
  const response = await axios.get(`http://${config.ip}:${config.back_port}/games/${gameId}`);
  return response.data;
};

// gameVVV userVVV
export const getCurrentUser = async (authenticationToken) => {
  const response = await axios.get(`http://${config.ip}:${config.back_port}/users/current`,
    {
      headers: {
        Authorization: authenticationToken,
      },
    }
  );
  return response.data;
};

// indexVVV 
export const login = async (email, password) => {
  const response = await axios.post(
    "http://" + config.ip + ":" + config.back_port + "/login/",
    { email, password },
    { timeout: 3000 });
  return response;
}

// purchaseVVV
export const purchase = async (gameId, cardHolderName, cvv, expirationDate, number, authenticationToken) => {
  const response = await axios.post(
    `http://${config.ip}:${config.back_port}/games/${gameId}/purchase`,
    {
      cardHolderName,
      cvv,
      expirationDate,
      number,
    },
    {
      headers: {
        Authorization: authenticationToken,
      },
    }
  );
  return response.data;
}

// registerVVV
export const register = async (email, password, name, image, backgroundImage) => {
  const response = await axios.post(
    "http://" + config.ip + ":" + config.back_port + "/register/",
    {
      email,
      password,
      name,
      image,
      backgroundImage,
    },
    { timeout: 3000 }
  );
  return response;
}

// userVVV
export const getUser = async (userId, authenticationToken) => {
  const response = await axios.get(
    `http://${config.ip}:${config.back_port}/users/` + userId,
    {
      headers: {
        Authorization: authenticationToken,
      },
    }
  );
  return response.data;
}
//userVVV
export const addOrRemoveFriend = async (userId, authenticationToken) => {
  const response = await axios.put(
    `http://${config.ip}:${config.back_port}/users/${userId}/friends`,
    {},
    {
      headers: {
        Authorization: authenticationToken,
      },
    }
  );
  return response;
}

//reviewVVV
export const addReview = async (gameId, isRecommended, reviewText, authenticationToken) => {
  const response = await axios.put(
    `http://${config.ip}:${config.back_port}/games/${gameId}/reviews`,
    {
      isRecommended: isRecommended,
      text: reviewText,
    },
    {
      headers: {
        Authorization: authenticationToken,
      },
    }
  );
  return response;
}

export const getRecomendedGames = async () => {
  const response = await axios.get(
    `http://${config.ip}:${config.back_port}/games/recommended`
  );
  return response.data;
}

export const getSearchGames = async (query, page = 1) => {
  const response = await axios.get(
    "http://" + config.ip + ":" + config.back_port + "/search/games",
    {
      params: {
        q: query,
        page,
      },
    }
  );
  return response.data;
}


