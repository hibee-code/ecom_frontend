export type SigninType = {
  email: string;
  password: string;
};

export interface PropertySubscriptionUnit {
  entitySubscriberPropertyId: string;
  createdAt: string;
  propertyType: {
    id: string;
    name: string;
    unitPrice: string;
    createdAt: string;
  };
}

export interface EntitySubscriberProfile {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  email: string;
  phone: string;
  createdAt: string;
  phoneCodeId: string;
  createdByEntityUserProfileId: string;
  createdByEntityProfileId: string;
  phoneCode: string;
}

export interface PropertySubscription {
  propertySubscriptionId: string;
  propertySubscriptionName: string;
  oldCode: string;
  streetNumber: string;
  createdAt: string;
  streetId: string;
  entitySubscriberProfileId: string;
  propertySubscriptionUnits: PropertySubscriptionUnit[];
  arrears: number;
  entitySubscriberProfile: EntitySubscriberProfile;
  streetName: string;
}

export type PropertySubscriptionArray = PropertySubscription[];

export type PaymentRecord = {
  id: string;
  amount: string;
  paymentDate: Date;
  propertySubscriptionId: string;
  payerName: string;
  year: string;
  month: string;
  propertySubscriptionName: string;
};
