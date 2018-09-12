import * as React from "react";
import { Layout } from "antd";
import { Header } from "./Header";
import {renderRoutes} from "react-router-config";
import { routes } from "../routes";

const PageLayout: React.StatelessComponent<{}> = () => {
    const header = window.location.href.includes('play') ? <Header /> : null
    return (
        <Layout className="ant-layout">
            <Layout>
                <Layout.Content>
                    {header}
                    {renderRoutes(routes)}
                </Layout.Content>
            </Layout>
        </Layout>
    );
};

export default PageLayout;
