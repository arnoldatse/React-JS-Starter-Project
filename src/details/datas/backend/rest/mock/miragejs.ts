import { createServer, Response, Model } from "miragejs"
import { loginUrl } from "../api/backend_endpoints"
import EnvKeys from "core/env/EnvKeys";
import ViteEnvAdapter from "details/env/vite/ViteEnvAdapter";

export default createServer({
    models: {
        user: Model,
    },
    seeds(server) {
        server.create('user', {
            id: '1',
            username: 'admin',
            role: 'admin'
        })
    },
    routes() {
        this.urlPrefix = new ViteEnvAdapter().get(EnvKeys.BACKEND_BASE_URL)!;

        this.post(loginUrl(), (schema, request) => {
            const credentials = JSON.parse(request.requestBody);
            if (credentials.email === 'admin@test.com' && credentials.password === 'admin') {
                return {
                    user: schema.db.users.findBy({ id: '1' }),
                    token: "fake-token"
                };
            }
            else if (credentials.email === 'adminbad@test.com') {
                return new Response(500, {}, { message: 'Internal server Error' })
            }
            return new Response(401, {}, { message: 'Bad credentials' })
        })
    },
})