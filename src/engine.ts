import type { AdministrationEvent, Medication, Patient, Validation } from './types';

export function validateAdministration(patient:Patient, med:Medication, dose:number, route:string, history:AdministrationEvent[]):Validation[] {
  const result:Validation[]=[]; const now=Date.now();
  if (!dose || dose <= 0) result.push({code:'MISSING_DOSE',severity:'critical',blocking:true,message:'A valid dose is required.'});
  if (!med.allowedRoutes.includes(route)) result.push({code:'ROUTE',severity:'critical',blocking:true,message:`${route} is not an allowed demo route for ${med.name}.`});
  const normalized=(value:string)=>value.replace(/^Demo\s+/i,'').toLowerCase();
  if (patient.allergies.some(a=>normalized(a)===normalized(med.name))) result.push({code:'ALLERGY',severity:'critical',blocking:true,message:`Recorded allergy: ${med.name}. Administration is blocked.`});
  if (dose > med.maxDose) result.push({code:'DOSE',severity:'critical',blocking:true,message:`Entered ${dose} ${med.unit}; configured demo maximum is ${med.maxDose} ${med.unit}.`});
  if (med.expiry < '2026-10') result.push({code:'EXPIRY',severity:'critical',blocking:true,message:`Batch ${med.batch} is expired (${med.expiry}).`});
  const same=history.filter(e=>e.patientId===patient.id && e.medicationId===med.id).sort((a,b)=>+new Date(b.timestamp)-+new Date(a.timestamp));
  if(same[0]) { const mins=(now-+new Date(same[0].timestamp))/60000; if(mins < med.minIntervalMinutes) result.push({code:'INTERVAL',severity:'warning',blocking:false,message:`Minimum demo interval is ${med.minIntervalMinutes} min; last dose was ${Math.round(mins)} min ago.`}); }
  const cumulative=same.filter(e=>now-+new Date(e.timestamp)<86400000).reduce((n,e)=>n+e.dose,0)+dose;
  if(cumulative>med.maxCumulative) result.push({code:'CUMULATIVE',severity:'critical',blocking:true,message:`24-hour demo cumulative dose would be ${cumulative} ${med.unit}; maximum is ${med.maxCumulative}.`});
  if(same.length) result.push({code:'DUPLICATE',severity:'attention',blocking:false,message:'This patient has previously received this medication. Confirm the record before continuing.'});
  return result;
}
