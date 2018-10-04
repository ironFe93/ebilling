import { InvoiceLine } from './invoiceLine';
import { TaxSubTotal } from './taxSubTotal';
export class Bill {
  _id?: string;
  ID?: string;
  IssueDate: Date;
  cond_pago: number;
  DueDate?: Date;
  InvoiceTypeCode: string;
  Note?: string;
  DocumentCurrencyCode: string;
  ////////
  DespatchDocumentReference?: {
    ID: string;
  };
  AdditionalDocumentReference?: {
    ID: string;
    DocumentTypeCode: number
  };
  AccountingSupplierParty?: {
    PartyIdentification: {
      ID: string;
      schemeID: string;
    };
    PartyName: string;
    PartyLegalEntity: {
      RegistrationName: string
    }
  };
  AccountingCustomerParty?: {
    PartyIdentification: {
      ID: string; // documento de identidad
      schemeID: string; // tipo de documento
    };
    PartyLegalEntity: {
      RegistrationName: string // nombre legal
    }
  };
  DeliveryTerms?: {
    DeliveryLocation: {
      Address: {
        StreetName: string;
        CitySubDivisionName: string;
        CityName: string;
        CountrySubentity: string;
        CountrySubentityCode: number; // ZIp code
        District: string;
        Country: {
          IdentificationCode: string
        }
      }
    }
  };
  AllowanceCharge: {
    ChargeIndicator: Boolean;
    AllowanceChargeReasonCode: string;
    MultiplierFactorNumeric: number;
    Amount?: number;
    BaseAmount?: number
  };
  TaxTotal?: {
    TaxAmount: number;
    TaxSubtotal: TaxSubTotal[];
  };
  LegalMonetaryTotal?: {
    LineExtensionAmount: number;
    TaxInclusiveAmount: number;
    AllowanceTotalAmount: number;
    ChargeTotalAmount: number;
    PrepaidAmount: number;
    PayableAmount: number
  };
  InvoiceLine: InvoiceLine[] = [];
  sumValues?: {};
  Status: {
    Description?: string;
    ResponseCode?: number;
    ID?: string;
    Draft: boolean;
    Rejected: boolean;
  };
}
