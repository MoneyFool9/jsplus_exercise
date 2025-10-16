import { resetCallbackIndex } from "./useCallback.jsx";
import { resetEffectIndex } from "./useEffect.jsx";
import { resetMemoIndex } from "./useMemo.jsx";

export async function render() {
	const App = (await import("./App.jsx")).default;
	const root = (await import("./main.jsx")).default;

	stateIndex = 0;
	resetEffectIndex();
	resetCallbackIndex();
	resetMemoIndex();
	root.render(<App />);
}
