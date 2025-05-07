// Support pour global, Buffer et process (utilisés par stompjs)
(window as any).global = window;
import 'zone.js';
import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;

import * as process from 'process';
(window as any).process = process;