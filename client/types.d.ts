declare module 'react-render-markup' {
  export interface MarkupProps {
    markup: string;
    replace?: Record<string, JSX.Element>;
  }

  export class Markup extends React.Component<MarkupProps> {}
}
