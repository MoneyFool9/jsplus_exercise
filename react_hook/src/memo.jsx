import PureComponent from "./PureComponent";

export function memo(Fc) {
  return class extends PureComponent {
    render() {
      return <Fc {...this.props} />
    }
  }
}