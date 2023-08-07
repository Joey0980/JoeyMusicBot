export default interface i18n {
    default: {
        localization_id: string,
        localization_name: string,

        base_command_dj_only: string,
        base_command_dj_or_admin: string,
        base_interaction_object_not_found: string,
        base_interaction_error_occurred: string,

        base_button: string,
        base_command: string,
        base_context_menu: string,
        base_interaction: string,
        base_select_menu: string,
        base_modal: string,

        base_cooldown: string,

        vc_user_absent: string,
        vc_user_different: string,

        playing_song: string,
        stopped: string,
        skipped: string,
        paused: string,
        unpaused: string,
        search_no_results: string,
        search_age_restricted: string,
        missing_permissions: string,
        no_songs: string,
        all_users_gone: string,
        error_music: string,
        live: string,

        finished: string,
        cleared: string,
        previous: string,
        no_previous: string,
        no_current_queue: string,
        queue_empty: string,
        queue_embed_title: string,
        queue_embed_description: string,
        queue_embed_upnexttitle: string,
        queue_embed_footer_1: string,
        queue_embed_footer_2: string,
        queue_embed_progress: string,
        queue_embed_toomany: string,

        added_queue_embed_title: string,
        added_queue_embed_footer: string,
        added_queue_embed_footer_nextup: string,

        nowplaying_embed_description: string,
        nowplaying_embed_title: string,

        joined: string,
        already_joined: string,
        left: string,
        could_not_join: string,

        volume_set: string,
        volume_syntax: string,

        shuffled: string,
        shuffle_too_few: string,

        export_error: string,
        export_success: string,

        export_embed_title: string,
        export_embed_guild: string,
        export_embed_shard: string,
        export_embed_date: string,

        remove_invalid: string,
        remove_success: string,
        filter_embed_title: string,
        filter_invalid: string,
        filter_off: string,
        filter_applied: string,
        seeked: string,
        seeked_invalid: string,

        dj_role_added: string,
        dj_role_removed: string,
        dj_role_already_added: string,
        dj_role_not_added: string,

        dj_requirement_enabled: string,
        dj_requirement_disabled: string,

        dj_requirement_already_enabled: string,
        dj_requirement_already_disabled: string,

        dj_role_list_empty: string,
        dj_role_list_preamble: string,

        dj_role_list_embed_title_enabled: string,
        dj_role_list_embed_title_disabled: string,

        lang_invalid_id: string,
        lang_set: string,

        lang_list_embed_title: string,
        lang_list_embed_field_ids: string,
        lang_list_embed_field_names: string,

        lang_reset: string,

        commands: { // in the future we can implement command localizations

        }
    }
}