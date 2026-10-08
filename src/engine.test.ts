import {describe,expect,it} from 'vitest';
import {seedState} from './data';
import {validateAdministration} from './engine';

const data=seedState(); const patient=data.patients[0]; const morphine=data.medications[0];
describe('demo safety rules',()=>{
 it('blocks doses over the configured demo maximum',()=>expect(validateAdministration(patient,morphine,99,'IV',[]).some(x=>x.code==='DOSE'&&x.blocking)).toBe(true));
 it('blocks invalid routes',()=>expect(validateAdministration(patient,morphine,5,'PO',[]).some(x=>x.code==='ROUTE')).toBe(true));
 it('blocks expired medication',()=>expect(validateAdministration(patient,data.medications[4],1,'IV',[]).some(x=>x.code==='EXPIRY')).toBe(true));
 it('blocks known allergies',()=>{const allergic=data.patients.find(p=>p.id==='P-1042')!;expect(validateAdministration(allergic,morphine,5,'IV',[]).some(x=>x.code==='ALLERGY')).toBe(true)});
 it('flags duplicate and minimum-interval administrations',()=>{const event={...data.administrations[0],patientId:patient.id,medicationId:morphine.id,timestamp:new Date().toISOString()};const v=validateAdministration(patient,morphine,5,'IV',[event]);expect(v.some(x=>x.code==='DUPLICATE')).toBe(true);expect(v.some(x=>x.code==='INTERVAL')).toBe(true)});
});
