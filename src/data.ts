import type { AdministrationEvent, State } from './types';
const ago=(m:number)=>new Date(Date.now()-m*60000).toISOString();
export function seedState():State {
 const patients=[
  {id:'P-1024',name:'Alex Rivera',age:34,weight:78,status:'STABLE' as const,allergies:[],barcode:'PT1024'},
  {id:'P-1019',name:'Sam Lee',age:52,weight:83,status:'URGENT' as const,allergies:['Demo Ketorolac'],barcode:'PT1019'},
  {id:'P-1031',name:'Jordan Kim',age:28,weight:65,status:'CRITICAL' as const,allergies:[],barcode:'PT1031'},
  {id:'P-1042',name:'Taylor Morgan',age:44,weight:91,status:'STABLE' as const,allergies:['Demo Morphine'],barcode:'PT1042'},
  {id:'P-1056',name:'Casey Patel',age:61,weight:72,status:'URGENT' as const,allergies:[],barcode:'PT1056'}];
 const medications=[
  {id:'MED-MOR',name:'Demo Morphine',barcode:'DMO-MOR-10',concentration:'10 mg/mL',unit:'mg' as const,allowedRoutes:['IV','IM'],maxDose:5,minIntervalMinutes:30,maxCumulative:20,batch:'DEMO-48291',expiry:'2028-04',quantity:12,location:'Bag 17'},
  {id:'MED-FEN',name:'Demo Fentanyl',barcode:'DMO-FEN-50',concentration:'50 mcg/mL',unit:'mcg' as const,allowedRoutes:['IV','IN'],maxDose:50,minIntervalMinutes:20,maxCumulative:200,batch:'DEMO-21008',expiry:'2027-11',quantity:9,location:'Bag 17'},
  {id:'MED-OND',name:'Demo Ondansetron',barcode:'DMO-OND-4',concentration:'4 mg/2mL',unit:'mg' as const,allowedRoutes:['IV','IM'],maxDose:4,minIntervalMinutes:240,maxCumulative:12,batch:'DEMO-78812',expiry:'2028-08',quantity:20,location:'Bag 12'},
  {id:'MED-KET',name:'Demo Ketorolac',barcode:'DMO-KET-30',concentration:'30 mg/mL',unit:'mg' as const,allowedRoutes:['IV','IM'],maxDose:15,minIntervalMinutes:360,maxCumulative:60,batch:'DEMO-44920',expiry:'2027-05',quantity:4,location:'Bag 12'},
  {id:'MED-OLD',name:'Demo Expired Sample',barcode:'DMO-OLD-1',concentration:'1 mg/mL',unit:'mg' as const,allowedRoutes:['IV'],maxDose:1,minIntervalMinutes:60,maxCumulative:4,batch:'DEMO-EXPIRED',expiry:'2025-01',quantity:2,location:'Training case'}];
 const providers=[{id:'1847',name:'Medic Alpha',role:'Medic',active:true},{id:'1922',name:'Medic Beta',role:'Senior Medic',active:true},{id:'3011',name:'Medic Gamma',role:'Paramedic',active:true}];
 const make=(i:number,p:string,m:string,dose:number,route:string,prov:string,sync:'SYNCED'|'PENDING'='SYNCED'):AdministrationEvent=>{const x=medications.find(z=>z.id===m)!;return {id:`seed-${i}`,patientId:p,medicationId:m,medicationName:x.name,concentration:x.concentration,dose,doseUnit:x.unit,route,providerId:prov,timestamp:ago(i*11+4),deviceId:'FIELD-TAB-17',barcode:x.barcode,batchId:x.batch,expiry:x.expiry,location:x.location,validationResults:[],warnings:[],syncStatus:sync,createdAt:ago(i*11+4)}};
 const administrations=Array.from({length:20},(_,i)=>make(i+1,patients[i%5].id,medications[i%4].id,[5,50,4,15][i%4],['IV','IV','IV','IM'][i%4],i%3===0?'1922':'1847',i===2?'PENDING':'SYNCED'));
 return {patients,medications,providers,administrations,audits:[],alerts:[{id:'a1',severity:'warning',title:'Offline queue',message:'1 administration event is waiting for synchronization.',timestamp:ago(4)},{id:'a2',severity:'critical',title:'Expired demo medication',message:'Demo Expired Sample must not be administered.',timestamp:ago(30)}],online:true,currentProviderId:'1847'};
}
