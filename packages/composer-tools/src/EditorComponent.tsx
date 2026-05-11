import * as React from "react";
import { v4 as uuidv4 } from "uuid";

const EventEmitter = { emit: (..._args: any[]) => {} };
const EVENTS = {
  COMPONENT_ADDED: "COMPONENT_ADDED",
  COMPONENT_DID_UPDATE: "COMPONENT_DID_UPDATE",
  RENDER_CONTENT_TAB: "RENDER_CONTENT_TAB",
  INSERT_FORM: "INSERT_FORM",
};

export function generateComponentId() {
  return uuidv4();
}

type PreSufFix = {
  label: string;
  className: string;
};

export type InteractionType = {
  type?: string;
  modal?: string;
  trigger_action?: string;
  visible_on?: string;
  show_once?: false;
};

export type PageInteractionType = {
  type?: string;
  modal?: string;
  scroll_depth?: number;
  delay_time?: number;
  visible_on?: string;
  show_once?: boolean;
  trigger_action?: string;
};

export type TypeLocation = {
  lng: number;
  lat: number;
};

export type TypeMediaInputValue =
  | { type: "image"; url: string }
  | { type: "icon"; name: string }
  | {
      type: "lottie";
      url: string;
      settings?: {
        autoplay?: boolean;
        loop?: boolean;
      };
    }
  | {
      type: "video";
      url: string;
      settings?: {
        autoplay?: boolean;
        controls?: boolean;
        loop?: boolean;
        muted?: boolean;
      };
    };

export type MediaType = "icon" | "image" | "video" | "lottie";

type CurrencyCode = string;

type currencyAdditionalParams = {
  showCode?: boolean;
  showSymbol?: boolean;
};

type GetPropValueProperties = {
  parent_object?: TypeUsableComponentProps[];
  as_string?: boolean;
  suffix?: PreSufFix;
  prefix?: PreSufFix;
};

type RangeInputAdditionalParams = {
  maxRange?: number;
  minRange?: number;
  step?: number;
};

export type CSSClass = {
  id: string;
  class: string;
};

export type TypeCSSProp = { [key: string]: CSSClass[] };

export interface iComponent {
  render(): any;
  getInstanceName(): string;
  getName(): string;
  getProps(): TypeUsableComponentProps[];
  getShadowProps(): TypeUsableComponentProps[];
  getPropValue(
    propName: string,
    properties?: GetPropValueProperties
  ): TypeUsableComponentProps;
  getExportedCSSClasses(): { [key: string]: string };
  getCSSClasses(): TypeCSSProp;
  getCSSClasses(sectionName: string | null): CSSClass[];
  getCSSClasses(sectionName?: string | null): TypeCSSProp | CSSClass[];
  getInteractions(sectionName?: string | null): any;
  addProp(prop: TypeUsableComponentProps): void;
  setProp(key: string, value: any): void;
  setCSSClasses(key: string, value: { id: string; class: string }[]): void;
  setInteraction(key: string, value: InteractionType[]): void;
  decorateCSS(cssValue: string): string;
  getCategory(): CATEGORIES;
  initializeProp(prop: TypeUsableComponentProps): void;
  id: string;
}

type AvailablePropTypes =
  | { type: "string"; value: string }
  | { type: "number"; value: number }
  | { type: "boolean"; value: boolean }
  | { type: "page"; value: string }
  | { type: "array"; value: TypeUsableComponentProps[] }
  | { type: "object"; value: TypeUsableComponentProps[] }
  | { type: "image"; value: string }
  | { type: "lottie"; value: string }
  | { type: "video"; value: string }
  | { type: "select"; value: string }
  | { type: "color"; value: string }
  | { type: "icon"; value: string }
  | { type: "email"; value: string }
  | { type: "location"; value: TypeLocation }
  | {
      type: "range";
      value: string;
      additionalParams?: RangeInputAdditionalParams;
    }
  | {
      type: "currency";
      value: { value: string; currency?: CurrencyCode };
      additionalParams?: currencyAdditionalParams;
    }
  | { type: "tag"; value: string[] }
  | {
      type: "phone";
      value: string;
      additionalParams?: {
        countriesEnabled?: boolean;
        phonePattern?:
          | "US"
          | "US_PARENTHESES"
          | "DOTTED"
          | "SPACED";
      };
    }
  | {
      type: "dateTime";
      value: string;
      additionalParams?: {
        mode?: string;
        timeInterval?: number;
        yearRange?: number;
        yearStart?: number;
      };
    }
  | { type: "multiSelect"; value: string[] }
  | { type: "file"; value: string }
  | { type: "media"; value: TypeMediaInputValue }
  | { type: "embededLink"; value: string };

export type TypeReactComponent = {
  type: string;
  props?: TypeUsableComponentProps[];
  cssClasses?: TypeCSSProp;
  interactions?: Record<string, InteractionType[]>;
  id?: string;
  customComponentId?: string;
  customComponentVersion?: number;
};

export type TypeUsableComponentProps = {
  id?: string;
  key: string;
  displayer: string;
  additionalParams?: {
    selectItems?: string[];
    maxElementCount?: number;
    availableTypes?: MediaType[];
  };
  max?: number;
} & AvailablePropTypes & {
  getPropValue?: (
    propName: string,
    properties?: GetPropValueProperties
  ) => any;
};

export enum CATEGORIES {
  NAVIGATOR = "navigator",
  TESTIMONIALS = "testimonials",
  LIST = "list",
  HERO_SECTION = "heroSection",
  INTRO_SECTION = "introSection",
  PRICING = "pricing",
  FOOTER = "footer",
  TEAM = "team",
  BLOG = "blog",
  FORM = "form",
  DOWNLOAD = "download",
  CALLTOACTION = "callToAction",
  SLIDER = "slider",
  FAQ = "faq",
  MODAL = "modal",
  LOGOCLOUDS = "logoClouds",
  STATS = "stats",
  FEATURE = "feature",
  IMAGEGALLERY = "imageGallery",
  LOCATION = "location",
  SOCIAL = "social",
  SOCIALWIDGET = "socialWidget",
  ECOMMERCE = "ecommerce",
  LEGAL = "legal",
  COMINGSOON = "comingSoon",
  BREADCRUMB = "breadcrumb",
  ABOUT = "about",
  PORTFOLIO = "portfolio",
  COMPARISON = "comparison",
  CUSTOM = "custom",
  TOP_BANNER = "topBanner",
  STICKY = "sticky",
}

export function generateId(key: string): string {
  return key + "-" + Math.round(Math.random() * 1000000000).toString();
}

//@ts-ignore
export abstract class Component
  extends React.Component<{}, { states: any; componentProps: any }>
  implements iComponent
{
  private shadowProps: TypeUsableComponentProps[] = [];
  private styles: any;
  public id: string;
  static category: CATEGORIES;

  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<{ states: any; componentProps: any }>,
    snapshot?: any
  ): void {
    EventEmitter.emit(EVENTS.COMPONENT_DID_UPDATE, { data: this });
    this.onComponentDidUpdate?.(prevProps, prevState, snapshot);
  }

  componentDidMount(): void {
    this.onComponentDidMount?.();
  }

  componentWillUnmount(): void {
    this.onComponentWillUnmount?.();
  }

  shouldComponentUpdate(
    nextProps: Readonly<{}>,
    nextState: Readonly<{ states: any; componentProps: any }>
  ): boolean {
    return this.onShouldComponentUpdate?.(nextProps, nextState) ?? true;
  }

  componentDidCatch(error: Error, info: { componentStack: string }): void {
    this.onComponentDidCatch?.(error, info);
  }

  constructor(props: any, styles: any) {
    super(props);
    this.styles = styles;
    this.id = props?.id || generateComponentId();

    let sectionsKeyValue: any = {};
    Object.keys(this.styles).forEach((key) => {
      sectionsKeyValue[key] = [];
    });

    const compProps = (props?.props || []).map((p: TypeUsableComponentProps) =>
      this.attachValueGetter(p)
    );
    this.state = {
      states: {},
      componentProps: {
        props: compProps,
        cssClasses: props?.cssClasses || { ...sectionsKeyValue },
        interactions: props?.interactions || { ...sectionsKeyValue },
      },
    };

    EventEmitter.emit(EVENTS.COMPONENT_ADDED, { data: this });
  }

  componentWillMount() {
    this.getProps().forEach(({ key, value }) => {
      const propIndex = this.state.componentProps.props.findIndex(
        (prop: any) => prop.key === key
      );
      if (propIndex === -1) return;

      const propInState: TypeUsableComponentProps =
        this.state.componentProps.props[propIndex];
      const shadowProp = this.getShadowProp(key);
      if (!shadowProp) {
        this.state.componentProps.props.splice(propIndex, 1);
        return;
      }

      const isComplexType =
        propInState.type === "array" || propInState.type === "object";
      const isTypeChanged = propInState.type !== shadowProp.type;

      if (isTypeChanged) {
        propInState.type = shadowProp.type;
        value = structuredClone(shadowProp.value);
      }

      if (isComplexType) {
        this.syncComplexValue(
          structuredClone(shadowProp.value) as TypeUsableComponentProps[],
          value as TypeUsableComponentProps[]
        );
      }

      const isMatchingValue =
        (!isComplexType && propInState.value === value) ||
        (isComplexType &&
          propInState.value.every((item) => item.getPropValue) &&
          propInState.value === value);

      if (isMatchingValue) return;

      this.state.componentProps.props[propIndex].value = value;
      this.state.componentProps.props[propIndex] = this.attachValueGetter(
        this.state.componentProps.props[propIndex]
      );
    });
  }

  static getName(): string {
    return this.name;
  }

  getName(): string {
    return (this.constructor as typeof Component).getName();
  }

  static getInstanceName(): string {
    return this.name;
  }

  getInstanceName(): string {
    return (this.constructor as typeof Component).name;
  }

  static getCategory(): CATEGORIES {
    return this.category;
  }

  getCategory(): CATEGORIES {
    return (this.constructor as typeof Component).category;
  }

  getProps(): TypeUsableComponentProps[] {
    return this.state.componentProps.props;
  }

  getShadowProps(): TypeUsableComponentProps[] {
    return this.shadowProps;
  }

  private getFilteredProp(
    key: string,
    props: TypeUsableComponentProps[]
  ): TypeUsableComponentProps | null {
    return (
      props.find((prop: TypeUsableComponentProps) => prop.key === key) || null
    );
  }

  getShadowProp(key: string): TypeUsableComponentProps | null {
    return this.getFilteredProp(key, this.shadowProps);
  }

  getProp(key: string): TypeUsableComponentProps | null {
    return this.getFilteredProp(key, this.state.componentProps.props);
  }

  getPropValue(propName: string, properties?: GetPropValueProperties): any {
    let prop =
      properties?.parent_object?.filter(
        (prop: TypeUsableComponentProps) => prop.key === propName
      )[0] || this.getProp(propName);

    const isStringMustBeElement =
      prop?.type == "string" && !properties?.as_string;

    return isStringMustBeElement
      ? this.getPropValueAsElement(prop, properties)
      : prop?.value;
  }

  getPropValueAsElement(
    prop: TypeUsableComponentProps,
    _properties?: GetPropValueProperties
  ) {
    return React.createElement("span", {
      dangerouslySetInnerHTML: { __html: prop.value as string },
    });
  }

  getExportedCSSClasses() {
    return this.styles;
  }

  getCSSClasses(): TypeCSSProp;
  getCSSClasses(sectionName: string | null): CSSClass[];
  getCSSClasses(sectionName: string | null = null): TypeCSSProp | CSSClass[] {
    const { cssClasses } = this.state.componentProps;
    return sectionName ? cssClasses[sectionName] : cssClasses;
  }

  private attachPropId(_prop: TypeUsableComponentProps) {
    if (_prop.type == "array" || _prop.type == "object") {
      (_prop.value as TypeUsableComponentProps[]).forEach(
        (v: TypeUsableComponentProps) => this.attachPropId(v)
      );
    } else {
      _prop.id = generateId(_prop.key);
    }
    return _prop;
  }

  addProp(prop: TypeUsableComponentProps) {
    this.shadowProps.push(JSON.parse(JSON.stringify(prop)));
    if (this.getProp(prop.key)) return;
    this.initializeProp(prop);
    this.state.componentProps.props.push(prop);
    EventEmitter.emit(EVENTS.RENDER_CONTENT_TAB);
  }

  removeProp(key: string) {
    this.shadowProps = this.shadowProps.filter((el) => el.key !== key);
    this.state.componentProps.props = this.state.componentProps.props.filter(
      (el: any) => el.key !== key
    );
    EventEmitter.emit(EVENTS.RENDER_CONTENT_TAB);
  }

  private syncComplexValue(
    source: TypeUsableComponentProps[],
    target: TypeUsableComponentProps[]
  ): void {
    source.forEach((sourceProp) => {
      const targetIndex = target.findIndex(
        (prop) => prop.key === sourceProp.key
      );
      if (targetIndex === -1) return;

      const targetProp = target[targetIndex];
      const isTypeChanged = targetProp.type !== sourceProp.type;
      const isComplexType =
        sourceProp.type === "array" || sourceProp.type === "object";

      if (isTypeChanged) {
        targetProp.type = sourceProp.type;
        targetProp.value = sourceProp.value;
        return;
      }

      if (isComplexType) {
        this.syncComplexValue(
          sourceProp.value as TypeUsableComponentProps[],
          targetProp.value as TypeUsableComponentProps[]
        );
      }
    });
  }

  setProp(key: string, value: any): void {
    let i = this.state.componentProps.props
      .map((prop: any) => prop.key)
      .indexOf(key);

    const prop: TypeUsableComponentProps = this.state.componentProps.props[i];

    const isInvalidIndex = i === -1;
    const isMatchingSimpleValue =
      prop.type !== "array" &&
      prop.type !== "object" &&
      prop.value === value;
    const isMatchingComplexValue =
      (prop.type === "array" || prop.type === "object") &&
      prop.value.every((item) => item.getPropValue) &&
      prop.value === value;

    if (isInvalidIndex || isMatchingSimpleValue || isMatchingComplexValue) {
      return;
    }

    this.state.componentProps.props[i].value = value;
    this.state.componentProps.props[i] = this.attachValueGetter(
      this.state.componentProps.props[i]
    );
    this.setState({ componentProps: { ...this.state.componentProps } });
  }

  setComponentState(key: string, value: any): void {
    const isSameValue = this.state.states[key] === value;
    if (isSameValue) return;
    this.state.states[key] = value;
    this.setState({ ...this.state });
  }

  getComponentState(key: string): any {
    return this.state.states[key];
  }

  setCSSClasses(key: string, value: { id: string; class: string }[]) {
    this.state.componentProps.cssClasses[key] = value;
    this.setState({ componentProps: this.state.componentProps });
  }

  setInteraction(key: string, value: InteractionType[]) {
    this.state.componentProps.interactions[key] = value;
    this.setState({ componentProps: this.state.componentProps });
  }

  getInteractions(sectionName: string | null = null): string {
    return sectionName
      ? this.state.componentProps.interactions[sectionName]
      : this.state.componentProps.interactions;
  }

  decorateCSS(section: string) {
    let cssClass = [this.styles[section]];

    let cssManuplations = Object.entries(this.getCSSClasses()).filter(
      ([p, v]) => v.length > 0
    );

    cssManuplations.forEach(([key, value]: any) => {
      if (key === section) {
        value.forEach((el: any) => {
          cssClass.push(el.class);
        });
      }
    });

    cssClass.push(generateAutoClassName(this.id, section));

    return cssClass.join(" ");
  }

  private attachValueGetter(propValue: TypeUsableComponentProps) {
    if (Array.isArray(propValue.value)) {
      if (propValue.type === "multiSelect") {
        propValue.value = propValue.value.filter(
          (value) => typeof value === "string"
        ) as string[];
        return propValue;
      }
      propValue.value = (propValue.value as any[]).filter((value: any) => value != null);
      propValue.value = (propValue.value as TypeUsableComponentProps[]).map(
        (propValueItem: TypeUsableComponentProps) => {
          if (Array.isArray(propValueItem.value)) {
            propValueItem = this.attachValueGetter(propValueItem);
            propValueItem["getPropValue"] = (
              propName: string,
              properties?: GetPropValueProperties
            ) => {
              if (!properties) properties = {};
              properties.parent_object =
                propValueItem.value as TypeUsableComponentProps[];
              return this.getPropValue(propName, properties);
            };
          }
          return propValueItem;
        }
      );
    }
    return propValue;
  }

  castToObject<Type>(propName: string): Type {
    let i = this.state.componentProps.props
      .map((prop: any) => prop.key)
      .indexOf(propName);
    let castedObject = this.castingProcess(this.state.componentProps.props[i]);
    return castedObject;
  }

  castToString(elem: React.JSX.Element): string | React.JSX.Element {
    const isValid = React.isValidElement(elem);
    return isValid
      ? (elem as any).props?.html?.replace(/<\/?[^>]+(>|$)/g, "")
      : elem;
  }

  private castingProcess(object: any) {
    let casted = object.value.map((propValue: any) => {
      let clonedPropValue = { ...propValue };
      if (clonedPropValue.hasOwnProperty("getPropValue")) {
        clonedPropValue.value.forEach((nestedObject: any) => {
          clonedPropValue[nestedObject.key] = clonedPropValue.getPropValue(
            nestedObject.key
          );
          if (nestedObject.hasOwnProperty("getPropValue")) {
            clonedPropValue[nestedObject.key] =
              this.castingProcess(nestedObject);
          }
        });
      } else {
        const value = this.getPropValue(clonedPropValue.key, {
          parent_object: object.value,
        });
        clonedPropValue = {
          key: clonedPropValue.key,
          value,
        };
      }
      return clonedPropValue;
    });

    if (object.type == "object") {
      const isObjectContainsAnotherObject = object.value.some(
        (val: TypeUsableComponentProps) => val.type == "object"
      );

      let tmpCasted = [...casted];
      casted = {};

      tmpCasted.forEach((manipulatedValue) => {
        const initialProp = manipulatedValue;
        let value: any = {};

        if (initialProp.type == "object" && isObjectContainsAnotherObject) {
          initialProp.value.forEach((propVal: any) => {
            value[propVal.key] = initialProp[propVal.key];
          });
        } else {
          value = manipulatedValue.value;
        }

        casted[manipulatedValue.key] = value;
      });
    }

    return casted;
  }

  insertForm(name: string, data: Object) {
    const inputData: { [key: string]: any } = {};
    const entries = Object.entries(data);
    entries.forEach(([_, value], index) => {
      inputData[`input_${index}`] = value;
    });
    EventEmitter.emit(EVENTS.INSERT_FORM, { name, data: inputData });
  }

  initializeProp(prop: TypeUsableComponentProps) {
    this.attachPropId(prop);
    this.attachValueGetter(prop);
  }

  onComponentDidMount() {}
  onComponentDidUpdate(
    _prevProps: Readonly<any>,
    _prevState: Readonly<any>,
    _snapshot?: any
  ) {}
  onComponentWillUnmount() {}
  onShouldComponentUpdate(
    _nextProps: Readonly<any>,
    _nextState: Readonly<any>
  ): boolean {
    return true;
  }
  onComponentDidCatch(_error: Error, _info: { componentStack: string }) {}
}

export function generateAutoClassName(componentId: string, section: string) {
  return `auto-generate-${componentId}-${section}`;
}

export abstract class BaseNavigator extends Component {
  static category = CATEGORIES.NAVIGATOR;
}
export abstract class Testimonials extends Component {
  static category = CATEGORIES.TESTIMONIALS;
}
export abstract class BaseList extends Component {
  static category = CATEGORIES.LIST;
}
export abstract class BaseHeroSection extends Component {
  static category = CATEGORIES.HERO_SECTION;
}
export abstract class BaseIntroSection extends Component {
  static category = CATEGORIES.INTRO_SECTION;
}
export abstract class BasePricingTable extends Component {
  static category = CATEGORIES.PRICING;
}
export abstract class BaseFooter extends Component {
  static category = CATEGORIES.FOOTER;
}
export abstract class Team extends Component {
  static category = CATEGORIES.TEAM;
}
export abstract class BaseBlog extends Component {
  static category = CATEGORIES.BLOG;
}
export abstract class BaseDownload extends Component {
  static category = CATEGORIES.DOWNLOAD;
}
export abstract class BaseCallToAction extends Component {
  static category = CATEGORIES.CALLTOACTION;
}
export abstract class BaseSlider extends Component {
  static category = CATEGORIES.SLIDER;
}
export abstract class BaseFAQ extends Component {
  static category = CATEGORIES.FAQ;
}
export abstract class BaseImageGallery extends Component {
  static category = CATEGORIES.IMAGEGALLERY;
}
export abstract class BaseModal extends Component {
  static category = CATEGORIES.MODAL;
}
export abstract class BaseLegal extends Component {
  static category = CATEGORIES.LEGAL;
}
export abstract class LogoClouds extends Component {
  static category = CATEGORIES.LOGOCLOUDS;
}
export abstract class BaseTopBanner extends Component {
  static category = (CATEGORIES as any).TOP_BANNER;
}
export abstract class Location extends Component {
  static category = CATEGORIES.LOCATION;
}
export abstract class BaseStats extends Component {
  static category = CATEGORIES.STATS;
}
export abstract class BaseContacts extends Component {
  static category = CATEGORIES.FORM;
}
export abstract class BaseFeature extends Component {
  static category = CATEGORIES.FEATURE;
}
export abstract class BaseSocial extends Component {
  static category = CATEGORIES.SOCIAL;
}
export abstract class BaseSocialWidget extends Component {
  static category = CATEGORIES.SOCIALWIDGET;
}
export abstract class BaseECommerce extends Component {
  static category = CATEGORIES.ECOMMERCE;
}
export abstract class BaseComingSoon extends Component {
  static category = CATEGORIES.COMINGSOON;
}
export abstract class BaseSticky extends Component {
  static category = (CATEGORIES as any).STICKY;
}
export abstract class BaseBreadcrumb extends Component {
  static category = CATEGORIES.BREADCRUMB;
}
export abstract class BaseAbout extends Component {
  static category = CATEGORIES.ABOUT;
}
export abstract class BasePortfolio extends Component {
  static category = CATEGORIES.PORTFOLIO;
}
export abstract class BaseComparison extends Component {
  static category = CATEGORIES.COMPARISON;
}
