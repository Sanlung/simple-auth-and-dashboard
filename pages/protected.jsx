import {withPageAuthRequired, getSession} from "@auth0/nextjs-auth0";

const Protected = () => <h1>This is a protected page</h1>;

export const getServerSideProps = withPageAuthRequired({
  returnTo: "/",
  getServerSideProps: async (ctx) => {
    const session = getSession(ctx.req, ctx.res);
    console.log(session);
    return {
      props: {},
    };
  },
});

export default Protected;
