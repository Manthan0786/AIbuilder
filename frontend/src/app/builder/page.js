'use client'

import { useSearchParams } from 'next/navigation';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { CodeEditor } from '../components/CodeEditor';
import { parseXml } from '../parseXML';
import { useEffect, useState } from 'react';
import { useWebContainer } from '../hooks/useWebContainer';
import { Preview } from '../components/preview';
import { TabView } from '../components/TabView';
import { parse } from 'path';

function Builder() {
  const searchParams = useSearchParams();
  const search = searchParams.get('data');
  const [currentstep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const webcontainer = useWebContainer();
  const [llmMessages, setLlmMessages] = useState([]);
  const [userPrompt, setUserPrompt] = useState('');

  useEffect(() => {
    init();
  }, [search]);

  async function init() {
    const response = await fetch("http://127.0.0.1:5000/template", { method: 'POST', body: JSON.stringify({ prompt: search }), headers: { 'Content-Type': 'application/json' } });
    const data = await response.json();
    const { prompts, uiprompt } = data;
    setSteps(parseXml(uiprompt[0]).map(x => ({
      ...x,
      status: "pending"
    })));
    setLoading(true);
    const stepsResponse = await fetch("http://127.0.0.1:5000/chat", {
      method: 'POST',
      body: JSON.stringify({
        messages: [...prompts, search].map(content => ({ role: "user", content }))
      }),
      headers: { 'Content-Type': 'application/json' }
    });
    const reader = await stepsResponse.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let xmlBuffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const dataresponse = JSON.parse(decoder.decode(value));
      xmlBuffer += dataresponse.text;
      let text = '';
      text += dataresponse.text;
      let match;
      while ((match = xmlBuffer.match(/<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/))) {
        const dataresponse = match[0];
        console.log(match);
        setSteps(s => [...s, ...parseXml(dataresponse).map((x) => ({
          ...x,
          status: "pending",
        }))]);
        xmlBuffer = xmlBuffer.slice(match.index + dataresponse.length);
      }
    }
  }


  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({ status }) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === "CreateFile") {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;

        let currentFolder = "";
        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);

          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path == currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
            // folder exists
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder);
            if (currentFileStructure && currentFileStructure.children) {
              currentFileStructure = currentFileStructure.children;
            }
          }
        }
        originalFiles = finalAnswerRef;
      }
    })

    if (updateHappened) {
      setFiles(originalFiles)
      setSteps(steps => steps.map((s) => {
        return {
          ...s,
          status: "completed"
        }

      }))
    }
  }, [steps, files]);

  //WebConatiner Mount
  useEffect(() => {
    function createmountstructure(files, isroot) {
      const mountfiles = {};
      const processfile = (file) => {
        if (file.type == 'folder') {
          mountfiles[file.name] = {
            directory:
              file.children ? Object.fromEntries(file.children.map(child => [child.name, processfile(child, false)])) : {}
          }
        } else if (file.type == 'file') {
          if (isroot) {
            mountfiles[file.name] = {
              file: {
                contents: file.content || ''
              }
            }
          } else {
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
        return mountfiles[file.name];
      }
      //console.log(files);
      files.forEach(file => {
        processfile(file, true)
      });

      return mountfiles;
    }
    const mountfiles = createmountstructure(files, true);
    webcontainer?.mount(mountfiles)
  }, [files]);

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <header className='bg-gray-800 border-b border-gray-700 px-6 py-4'>
          <h1 className='text-xl font-semibold text-gray-100'>Website Builder</h1>
          <p className='text-sm text-gray-400 mt-1'>Prompt: {search}</p>
        </header>
        <div className='h-full grid grid-cols-4 gap-1 p-2'>
          <div className="col-span-1 space-y-6 h-auto overflow-auto">
            <StepsList steps={steps} setSteps={setSteps} currentstep={currentstep} onStepClick={setCurrentStep} loading={loading} llmmessages={llmMessages} setLlmMessages={setLlmMessages} />
            <div className='bg-gray-900 rounded-lg shadow-lg p-2'>
              <textarea className='bg-black h-40 outline-none rounded-lg' placeholder='Any edits' onChange={(e) => { setUserPrompt(e.target.value) }}></textarea>
              <div>
                <button onClick={
                  async () => {
                    const newMessage = {
                      role: "user",
                      content: userPrompt
                    };

                    setLoading(true);
                    const stepsResponse = await fetch("http://127.0.0.1:5000/chat", {
                      method: 'POST',
                      body: JSON.stringify({
                        messages: [...llmMessages, newMessage]
                      }), headers: { 'Content-Type': 'application/json' }
                    });
                    setLoading(false);

                    setLlmMessages(x => [...x, newMessage]);
                    setLlmMessages(x => [...x, {
                      role: "assistant",
                      content: stepsResponse.data.response
                    }]);
                    console.log(stepsResponse.data);

                    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                      ...x,
                      status: "pending"
                    }))]);

                  }} className='bg-purple-400 px-4'>Send</button>
              </div>
            </div>
          </div>
          <div className='col-span-1'>
            <FileExplorer files={files} onFileSelect={setSelectedFile} />
          </div>
          <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className='col-span-2 h-full'>
              {
                activeTab === 'code' ? <CodeEditor files={files} selectedfile={selectedFile} /> :
                  <Preview webContainer={webcontainer} files={files} />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Builder;