import { WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';

export function useWebContainer() {
    let webContainerInstance = null;
    const [webcontainer, setWebContainer] = useState(webContainerInstance);
    async function main() {
        console.log('Running Once!!')
        const webcontainerInatance = await WebContainer.boot();
        setWebContainer(webcontainerInatance);
    }
    useEffect(() => {
        if (!webContainerInstance) {
            main()
        }
    }, [])
    return webcontainer
}