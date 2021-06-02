/**
 * Server calls of application client.
 */
import { Client } from "uu_appg01";

const call = async (method, uri, dtoIn) => {
    let response = await Client[method](uri, dtoIn, {});
    return response.data;
};

let Calls = {
    /** URL containing app base, e.g. "https://uuos9.plus4u.net/vnd-app/awid/". */


    createRecipe(dtoIn) {
        let commandUri = Calls.getCommandUri("recipe/create");
        return call("post", commandUri, dtoIn.data);
    },

    getRecipe(dtoIn) {
        let commandUri = Calls.getCommandUri("recipe/get");
        return call("get", commandUri, dtoIn.data);
    },

    updateRecipe(dtoIn) {
        let commandUri = Calls.getCommandUri("recipe/update");
        return call("post", commandUri, dtoIn.data);
    },

    deleteRecipe(dtoIn) {
        let commandUri = Calls.getCommandUri("recipe/delete");
        return call("post", commandUri, dtoIn.data);
    },

    listRecipes(dtoIn) {
        let commandUri = Calls.getCommandUri("recipe/list");
        return call("get", commandUri, dtoIn.data);
    },

    recipeImageCreate(dtoIn) {
        let commandUri = Calls.getCommandUri("recipeImage/create");
        return call("post", commandUri, dtoIn.data, { contentType: "multipart/form-data"});
    },


    createIngredient(dtoIn) {
        let commandUri = Calls.getCommandUri("ingredient/create");
        return call("post", commandUri, dtoIn.data);
    },

    getIngredient(dtoIn) {
        let commandUri = Calls.getCommandUri("ingredient/get");
        return call("get", commandUri, dtoIn.data);
    },

    updateIngredient(dtoIn) {
        let commandUri = Calls.getCommandUri("ingredient/update");
        return call("post", commandUri, dtoIn.data);
    },

    approveIngredient(dtoIn) {
        let commandUri = Calls.getCommandUri("ingredient/approve");
        return call("post", commandUri, dtoIn.data);
    },

    deleteIngredient(dtoIn) {
        let commandUri = Calls.getCommandUri("ingredient/delete");
        return call("post", commandUri, dtoIn.data);
    },

    listIngredients(dtoIn) {
        let commandUri = Calls.getCommandUri("ingredient/list");
        return call("get", commandUri, dtoIn.data);
    },





    /*
    For calling command on specific server, in case of developing client site with already deployed
    server in uuCloud etc. You can specify url of this application (or part of url) in development
    configuration in *-client/env/development.json, for example:
     {
       ...
       "uu5Environment": {
         "gatewayUri": "https://uuos9.plus4u.net",
         "tid": "84723877990072695",
         "awid": "b9164294f78e4cd51590010882445ae5",
         "vendor": "uu",
         "app": "demoappg01",
         "subApp": "main"
       }
     }
     */
    getCommandUri(aUseCase, uri = "http://localhost:3000") {
        // useCase <=> e.g. "getSomething" or "sys/getSomething"
        // add useCase to the application base URI
        if (uri.charAt(uri.length - 1) !== "/") uri += "/";
        return uri + aUseCase.replace(/^\/+/, "");
    },
};

export default Calls;
