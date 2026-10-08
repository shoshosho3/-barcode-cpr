export type SyncStatus = 'SYNCED' | 'PENDING';
export type Severity = 'critical' | 'warning' | 'attention' | 'info';
export interface Patient { id:string; name:string; age:number; weight:number; status:'STABLE'|'URGENT'|'CRITICAL'; allergies:string[]; barcode:string }
export interface Medication { id:string; name:string; barcode:string; concentration:string; unit:'mg'|'mcg'; allowedRoutes:string[]; maxDose:number; minIntervalMinutes:number; maxCumulative:number; batch:string; expiry:string; quantity:number; location:string }
export interface Provider { id:string; name:string; role:string; active:boolean }
export interface Validation { code:string; severity:Severity; message:string; blocking:boolean }
export interface AdministrationEvent { id:string; patientId:string; medicationId:string; medicationName:string; concentration:string; dose:number; doseUnit:string; route:string; providerId:string; timestamp:string; deviceId:string; barcode:string; batchId:string; expiry:string; location:string; validationResults:Validation[]; warnings:Validation[]; syncStatus:SyncStatus; createdAt:string }
export interface AuditEvent { id:string; type:string; timestamp:string; providerId:string; deviceId:string; patientId?:string; medicationId?:string; metadata?:Record<string,unknown> }
export interface Alert { id:string; severity:Severity; title:string; message:string; timestamp:string; patientId?:string }
export interface State { patients:Patient[]; medications:Medication[]; providers:Provider[]; administrations:AdministrationEvent[]; audits:AuditEvent[]; alerts:Alert[]; online:boolean; currentProviderId:string }
