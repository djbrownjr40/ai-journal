declare module 'basic-auth' {
    interface BasicAuth {
      name: string;
      pass: string;
    }
  
    function basicAuth(req: any): BasicAuth | undefined;
  
    export default basicAuth;
  }