export interface InvoiceLine {
    ID?: number;
    tipo: string;
    InvoicedQuantity: {
        unitCode?: string;
        val?: number
    };
    LineExtensionAmount?: number;
    PricingReference?: {
        AlternativeConditionPrice: {
            PriceAmount: number;
            PriceTypeCode: string
        }
    };
    AllowanceCharge?: {
        ChargeIndicator: Boolean;
        AllowanceChargeReasonCode: string;
        MultiplierFactorNumeric: number;
        Amount?: number;
        BaseAmount?: number
    };
    TaxTotal?: {
        TaxAmount: number;
        TaxSubtotal: {
            TaxableAmount: number;
            TaxAmount: number;
            TaxCategory: {
                TaxExemptionReasonCode: number;
                Percent: number
            }
        }
    };
    Item: {
        Description: string;
        SellersItemIdentification: {
            ID: string
        }
    };
    Price?: {
        PriceAmount: number
    };
}
