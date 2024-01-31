export interface ICoord {
    x: number;
    y: number;
}

export interface IEngineSettings {
    alert_errors: boolean;
    log_info: boolean;
    tile_size: number;
    limit_viewport: boolean;
    jump_switch: boolean;
    viewport: ICoord;
    camera: ICoord;
    key: {
      left: boolean;
      right: boolean;
      up: boolean;
    };
    player: {
      loc: ICoord;
      vel: ICoord;
      can_jump: boolean;
    };
}

export const DEFAULT_ENGINE_SETTINGS = {
    alert_errors: false,
    log_info: true,
    tile_size: 16,
    limit_viewport: false,
    jump_switch: 0,
    viewport: {
        x: 200,
        y: 200
    },
    camera: {
        x: 0,
        y: 0
    },
    key: {
        left: false,
        right: false,
        up: false
    },
    player: {
        loc: {
            x: 0,
            y: 0
        },
        vel: {
            x: 0,
            y: 0
        },
        can_jump: true
    }
}