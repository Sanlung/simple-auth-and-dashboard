// Layout applied to all pages and contains <title>
// and <meta> tags and internal links in <head>
import Head from "next/head";
import {Container} from "reactstrap";

const Layout = ({children}) => (
  <>
    <Head>
      <link rel='icon' href='/favicon.ico' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta
        name='description'
        content='A simple demo for user authentication and dashboard management backend APIs'
      />
      <meta name='author' content='Chung Kao' />
      <title>Simple Auth & Dashboard Demo</title>
    </Head>
    <Container className='pt-5'>{children}</Container>
  </>
);

export default Layout;
