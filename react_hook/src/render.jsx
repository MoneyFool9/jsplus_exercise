import { resetCallbackIndex } from "./useCallback.jsx";
import { resetEffectIndex } from "./useEffect.jsx";
import { resetMemoIndex } from "./useMemo.jsx";
import { resetRefIndex } from "./useRef.jsx";
import { resetStateIndex } from "./useState.jsx";

export async function render() {
	const App = (await import("./App.jsx")).default;
	const root = (await import("./main.jsx")).default;

	resetStateIndex();
	resetEffectIndex();
	resetCallbackIndex();
  resetMemoIndex();
  resetRefIndex();
	root.render(<App />);
}
