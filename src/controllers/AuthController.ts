import { interfaces, controller } from 'inversify-express-utils';
import BaseController from './BaseController';

@controller('/')
class AuthController extends BaseController implements interfaces.Controller
{

}

export default AuthController;