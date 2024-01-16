import {IDictionary, IParam, IService} from "../interfaces/interfaces";
import {responses} from "../responses/responses";


export abstract class Service implements IService<IParam> {

  public async addConfig(param: IParam): Promise<IDictionary<any>> { throw responses.funcNotImplemented }

  public async deleteConfig(param: IParam): Promise<IDictionary<any>> { throw responses.funcNotImplemented }

  public async getConfig(param: IParam): Promise<IDictionary<any>> { throw responses.funcNotImplemented }

  public async setConfig(param: IParam): Promise<IDictionary<any>> { throw responses.funcNotImplemented }

  public async getData(param: IParam): Promise<IDictionary<any>> { throw responses.funcNotImplemented }

  public async exec(param: IParam): Promise<IDictionary<any>> { throw responses.funcNotImplemented }

  public call = async (data: IParam) => { }

  public interrupt = async () => { }

  public start = async () => { }

  public stop = async () => { }

}