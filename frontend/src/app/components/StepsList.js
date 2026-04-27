import { CheckCircle, Circle, Clock } from 'lucide-react';

export function StepsList({ steps, currentstep, onStepClick }) {
    const uniqueSteps = new Map();
    steps.forEach((step) => {
        uniqueSteps.set(step.title, step); // Use 'id' as the unique identifier
    });
    const uniquesteps = Array.from(uniqueSteps.values())
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Build Steps</h2>
            <div className="space-y-2">
                {
                    uniquesteps.map((step, index) =>
                        <div
                            key={index}
                            className={`cursor-pointer rounded-xl border p-3 transition ${currentstep === index
                                    ? 'border-blue-200 bg-blue-50'
                                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                }`}
                            onClick={() => onStepClick(index)}>
                            <div className="flex items-center gap-2">
                                {step.status === 'completed' ? (
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                ) : step.status === 'in-progress' ? (
                                    <Clock className="h-5 w-5 text-blue-500" />
                                ) : (
                                    <Circle className="h-2 w-2 text-slate-400" />
                                )}
                                <div>
                                    <h4 className="font-medium text-slate-800">{step.title}</h4>
                                    <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                                    {step.type === 'RunScript' && <p className='mt-2 rounded-md bg-slate-900 px-2 py-1 font-mono text-xs text-slate-100'>{step.code}</p>}
                                </div>
                            </div>
                        </div>
                    )
                }
              
            </div>
        </div>
    )
}
