import {
    Stitch,
    GoogleRedirectCredential,
    RemoteMongoClient,
} from "mongodb-stitch-browser-sdk"
import { writable } from "svelte/store"

const client = Stitch.initializeDefaultAppClient("buddy-yoaxh")
export const auth = client.auth
export const user = writable(client.auth.currentUser)
const mongodb = client.getServiceClient(
    RemoteMongoClient.factory,
    "mongodb-atlas"
)
export const db = mongodb.db("buddy")

if (client.auth.hasRedirectResult()) {
    client.auth.handleRedirectResult().then(user_ => {
        user.set(user_)
    })
}

export function login() {
    const credential = new GoogleRedirectCredential()
    client.auth.loginWithRedirect(credential)
}
