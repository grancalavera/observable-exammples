import { map, of } from "rxjs";
import { repeater } from "./repeater";

of("ok computer").pipe(map(repeater)).subscribe(console.log);
