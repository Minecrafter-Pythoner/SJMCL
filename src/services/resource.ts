import { invoke } from "@tauri-apps/api/core";
import { ModLoaderType } from "@/enums/instance";
import {
  GameResourceInfo,
  ModLoaderResourceInfo,
  ModUpdateQuery,
  OtherResourceFileInfo,
  OtherResourceSearchRes,
  OtherResourceVersionPack,
} from "@/models/resource";
import { InvokeResponse } from "@/models/response";
import { responseHandler } from "@/utils/response";

/**
 * Service class for managing game & mod loader resources.
 */
export class ResourceService {
  /**
   * FETCH the list of game versions.
   * @returns {Promise<InvokeResponse<GameResourceInfo[]>>}
   */
  @responseHandler("resource")
  static async fetchGameVersionList(): Promise<
    InvokeResponse<GameResourceInfo[]>
  > {
    return await invoke("fetch_game_version_list");
  }

  /**
   * FETCH the list of mode loader versions.
   * @returns {Promise<InvokeResponse<ModLoaderResourceInfo[]>>}
   */
  @responseHandler("resource")
  static async fetchModLoaderVersionList(
    gameVersion: string,
    modLoaderType: ModLoaderType
  ): Promise<InvokeResponse<ModLoaderResourceInfo[]>> {
    return await invoke("fetch_mod_loader_version_list", {
      gameVersion,
      modLoaderType,
    });
  }

  /**
   * FETCH the list of resources according to the given parameters.
   * @returns {Promise<InvokeResponse<OtherResourceSearchRes>>}
   */
  @responseHandler("resource")
  static async fetchResourceListByName(
    resourceType: string,
    searchQuery: string,
    gameVersion: string,
    selectedTag: string,
    sortBy: string,
    downloadSource: string,
    page: number,
    pageSize: number
  ): Promise<InvokeResponse<OtherResourceSearchRes>> {
    return await invoke("fetch_resource_list_by_name", {
      downloadSource,
      query: {
        resourceType,
        searchQuery,
        gameVersion,
        selectedTag,
        sortBy,
        page,
        pageSize,
      },
    });
  }

  /**
   * FETCH the version packs for a specific resource.
   * @returns {Promise<InvokeResponse<OtherResourceVersionPack[]>>}
   */
  @responseHandler("resource")
  static async fetchResourceVersionPacks(
    resourceId: string,
    modLoader: ModLoaderType | "All",
    gameVersions: string[],
    downloadSource: string
  ): Promise<InvokeResponse<OtherResourceVersionPack[]>> {
    return await invoke("fetch_resource_version_packs", {
      downloadSource,
      query: {
        resourceId,
        modLoader,
        gameVersions,
      },
    });
  }

  /**
   * DOWNLOAD a game server.
   * @param {GameResourceInfo} resourceInfo - The resource information of the game server.
   * @param {string} dest - The destination path to save the downloaded server file.
   * @returns {Promise<InvokeResponse<void>>}
   */
  @responseHandler("resource")
  static async downloadGameServer(
    resourceInfo: GameResourceInfo,
    dest: string
  ): Promise<InvokeResponse<void>> {
    return await invoke("download_game_server", {
      resourceInfo,
      dest,
    });
  }

  /**
   * FETCH a remote resource info by local file.
   * @param filePath The file path of the resource.
   * @param downloadSource The source from which to download the resource.
   * @returns {Promise<InvokeResponse<OtherResourceFileInfo>>}
   */
  @responseHandler("resource")
  static async fetchRemoteResourceByLocal(
    downloadSource: string,
    filePath: string
  ): Promise<InvokeResponse<OtherResourceFileInfo>> {
    return await invoke("fetch_remote_resource_by_local", {
      downloadSource,
      filePath,
    });
  }

  /**
   * DOWNLOAD the latest mod file.
   * @param url The download URL of the mod file.
   * @param sha1 The SHA1 hash of the mod file.
   * @param filePath The destination path to save the downloaded mod file.
   * @param oldFilePath The path of the old mod file to be renamed.
   * @returns {Promise<InvokeResponse<void>>}
   */
  @responseHandler("resource")
  static async updateMods(
    instanceId: string,
    queries: ModUpdateQuery[]
  ): Promise<InvokeResponse<void>> {
    return await invoke("update_mods", {
      instanceId,
      queries,
    });
  }
}
