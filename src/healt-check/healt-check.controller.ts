import {Controller, Get} from '@nestjs/common';

@Controller('/')
export class HealtCheckController {

    @Get()
    healtCheck() {
        return 'Payments Webhook is up and running'
    }
}
