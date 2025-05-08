import { CheckCircle, Circle, Clock } from 'lucide-react';

export function StepsList({ steps, currentstep, onStepClick }) {
    const uniqueSteps = new Map();
    steps.forEach((step) => {
        uniqueSteps.set(step.title, step); // Use 'id' as the unique identifier
    });
    const uniquesteps = Array.from(uniqueSteps.values())
    return (
        <div className="bg-gray-900 rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-100">Build Steps</h2>
            <div>
                {
                    uniquesteps.map((step, index) =>
                        <div
                            key={index}
                            className={`flex items-center justify-between p-2 border-b border-gray-700 cursor-pointer ${currentstep === index ? 'bg-gray-800' : ''}`}
                            onClick={() => onStepClick(index)}>
                            <div className="flex items-center gap-2">
                                {step.status === 'completed' ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : step.status === 'in-progress' ? (
                                    <Clock className="w-5 h-5 text-blue-400" />
                                ) : (
                                    <Circle className="w-2 h-2 text-gray-600" />
                                )}
                                <div>
                                    <h4 className="font-medium text-gray-100">{step.title}</h4>
                                    <p className="text-sm text-gray-400 mt-2">{step.description}</p>
                                    {step.type === 'RunScript' && <p className='bg-black flex'>{step.code}</p>}
                                </div>
                            </div>
                        </div>
                    )
                }
              
            </div>
        </div>
    )
}
