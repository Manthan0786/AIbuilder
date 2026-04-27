import Editor from '@monaco-editor/react';

export function CodeEditor({ files, selectedfile }) {
    return (
       <div className="h-full">
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-2">
                {selectedfile !== null ? <Editor value={selectedfile.content || ""} 
                height="70vh"
                theme="light"
                loading="Loading..."
                defaultLanguage='javascript'/> : <div className="flex h-40 items-center justify-center text-sm text-slate-500">Select a file to start editing.</div>}
            </div> 
        </div>
    )
}
