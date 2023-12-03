import express from 'express';
const { crypt } = await import('./crypt.js');
import qs from 'qs';
// require('dotenv').config()
import * as dotevnv from "dotenv";

dotevnv.config();

const router = express.Router();

const CLIENTID = process.env.BAS_CLIENT_ID
const CLIENT_SECRET = process.env.BAS_CLIENT_SECERT
const BASURL = process.env.BAS_BASE_URL
let access_token;

router.post('/payment', async (req, res) => {
    var { authid } = req.body
    console.log("paymentInfo req :", req.body)

    if (authid) {
        await getBasToken(authid).then(async (response) => {
            let data = await response.json()
            console.log("response :", data)
            access_token = data.access_token
            await getBasUserInfo(access_token).then(async (user) => {
                let userData = await user.json()
                console.log("user :", data)
                return res.status(200).json(userData)
            }).catch((error) => {
                let data = error?.response?.data ?? '{}'
                console.error("Error :", data)
                return res.status(409).send(data)
            })
        }).catch((error) => {
            let data = error?.response?.data ?? '{}'
            console.error("Error :", data)
            return res.status(409).send(data)
        })
    } else {
        res.status(409).json({ status: 0, success: false, msg: "Authid Required" })
    }


});

async function getBasToken(authid) {
    console.log("getBasToken :", authid)
    if (authid) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        console.log("getBasToken :", myHeaders)

        var urlencoded = new URLSearchParams();
        urlencoded.append("client_id", CLIENTID);
        urlencoded.append("client_secret", CLIENT_SECRET);
        urlencoded.append("grant_type", "authorization_code");
        urlencoded.append("code", authid);
        urlencoded.append("redirect_uri", `${BASURL}/api/v1/auth/callback`);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        var url = `${BASURL}/api/v1/auth/token`

        console.log("params :", url, urlencoded.toString());
        return await fetch(url, requestOptions)
    }
}
async function getBasUserInfo(token) {
    console.log("getBasUserInfo :", token)
    if (token) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);
        console.log("getBasUserInfo :", myHeaders)
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        var url = `${BASURL}/api/v1/auth/userinfo`
        console.log("params :", url);
        return await fetch(url, requestOptions)
    }
}

async function initPayment(authid) {
    if (authid) {
        var params = {};
        /* initialize an array */
        params['client_id'] = CLIENTID
        params['client_secret'] = MKEY
        params['grant_type'] = 'authorization_code'
        params['code'] = authid
        params['redirect_uri'] = `${BASURL}/api/v1/auth/callback`
        // params['redirect_uri'] = `https://stagebas.yk-bank.com:9101/api/v1/auth/callback`

        console.log("params :", params)

        await fetch(`${BASURL}/api/v1/auth/token`, {
            body: qs.stringify(params), method: "POST", headers: {
                "Content-Type": 'application/x-www-form-urlencoded'
            }
        })
            .then(async (response) => {
                let data = await response.json()
                console.log("response :", data)
                res.status(200).json(data)
            }).catch((error) => {
                let data = error?.response?.data ?? '{}'
                console.error("Error :", data)
                res.status(500).send(data)
            })
    }
}

export default router;
