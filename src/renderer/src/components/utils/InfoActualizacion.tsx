/* eslint-disable prettier/prettier */
import useAppContext from '@renderer/hooks/useAppContext';
import Markdown from 'markdown-to-jsx';
import { useEffect, useState } from 'react';
import 'github-markdown-css';
import '@renderer/css/main.css';

type propsType = {
    version: string
}

export default function InfoActualizacion(props: propsType): JSX.Element {
    const { messageModal } = useAppContext();
    const [data, setData] = useState<string>();
    useEffect(() => {
        obtenerInfoVersion();
    }, [])
    const obtenerInfoVersion = async (): Promise<void> => {
        try {
            const request = {
                action: "Get_info_update_app_desktop"
            }
            const response = await window.api.server2(request);
            if (response.status !== 200)
                throw new Error(`Code ${response.status}: ${response.message}`);
            setData(response.data);

        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
        }
    }

    const handleLinkClick = async (url: string): Promise<void> => {
        try {
            await window.api.openExternalLink(url);
        } catch (error) {
            if (error instanceof Error) {
                messageModal("error", error.message);
            }
        }
    };

    if (!data) {
        return <div>Cargando...</div>
    }
    // Personalización del renderizado de enlaces
    const overrides = {
        a: {
            component: (props: { href?: string; children: React.ReactNode }) => (
                <a
                    href="#"
                    onClick={(e): void => {
                        e.preventDefault();
                        if (props.href) handleLinkClick(props.href);
                    }}
                >
                    {props.children}
                </a>
            ),
        },
    };
    return (
        <div className="componentContainer">
            <div className="navBar"></div>
            <h2>Actualización {props.version}</h2>
            <hr />
            <div className="markdown-body custom-markdown">
                <Markdown options={{ overrides }}>{data}</Markdown>
            </div>
        </div>
    )
}
