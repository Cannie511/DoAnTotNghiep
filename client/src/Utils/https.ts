import axios, {AxiosInstance} from 'axios'
const backend_domain = process.env.NEXT_PUBLIC_BACK_END_DOMAIN;
class Http{
    instance: AxiosInstance;
    constructor(){
        this.instance = axios.create({
            baseURL: backend_domain,
            timeout: 10000,
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials:true,
        })
    }
}

const http = new Http().instance;
export default http